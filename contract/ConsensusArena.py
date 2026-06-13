# v0.2.20
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
from dataclasses import dataclass
import json


@allow_storage
@dataclass
class Topic:
    id: u256
    category: str
    question: str
    option_a: str
    option_b: str
    resolved: bool
    winner: str


@allow_storage
@dataclass
class Vote:
    voter: Address
    choice: str
    reason: str
    score: u256


@allow_storage
@dataclass
class UserProfile:
    total_score: u256
    votes_count: u256


class ConsensusArena(gl.Contract):
    owner: Address
    current_round: u256
    topics: DynArray[Topic]
    topic_votes: TreeMap[u256, DynArray[Vote]]
    user_profiles: TreeMap[Address, UserProfile]
    users: DynArray[Address]
    voted: TreeMap[str, bool]

    def __init__(self):
        self.owner = gl.message.sender_address
        self.current_round = u256(0)
        self.users = []

    @gl.public.write
    def generate_round(self):
        if gl.message.sender_address != self.owner:
            raise gl.vm.UserError("only owner")

        def leader_fn():
            prompt = """
            Generate exactly 5 debate topics.

            Categories:
            Crypto
            Technology
            Economy
            Sports
            Society

            Rules:
            - Exactly two options
            - Question under 120 chars
            - Option under 30 chars
            - JSON only

            {
            "topics":[
                {
                    "category":"",
                    "question":"",
                    "option_a":"",
                    "option_b":""
                }
            ]
            }
            """
            raw = gl.nondet.exec_prompt(prompt)
            raw = raw.replace("```json", "")
            raw = raw.replace("```", "")
            return raw

        def validator_fn(result):
            if not isinstance(result, gl.vm.Return):
                return False
            try:
                data = json.loads(result.calldata)
                topics = data.get("topics", [])
                if len(topics) != 5:
                    return False
                return True
            except:
                return False

        raw = gl.vm.run_nondet_unsafe(
            leader_fn,
            validator_fn
        )

        data = json.loads(raw)
        self.topics = []
        idx = 0

        for t in data["topics"]:
            topic = Topic(
                id=u256(idx),
                category=t["category"],
                question=t["question"],
                option_a=t["option_a"],
                option_b=t["option_b"],
                resolved=False,
                winner=""
            )
            self.topics.append(topic)
            idx += 1

        self.current_round += u256(1)

    @gl.public.view
    def get_topics(self) -> list:
        result = []
        for topic in self.topics:
            result.append({
                "id": int(topic.id),
                "category": topic.category,
                "question": topic.question,
                "option_a": topic.option_a,
                "option_b": topic.option_b,
                "resolved": topic.resolved,
                "winner": topic.winner
            })
        return result

    @gl.public.write
    def vote(
        self,
        topic_id: u256,
        choice: str,
        reason: str
    ):
        sender = gl.message.sender_address

       
        topic_exists = False
        for t in self.topics:
            if t.id == topic_id:
                topic_exists = True
                break
        
        if not topic_exists:
            raise gl.vm.UserError("Topic does not exist")

        if len(reason) > 100:
            raise gl.vm.UserError("reason too long")

        vote_key = sender.as_hex + ":" + str(topic_id)
        if self.voted.get(vote_key, False):
            raise gl.vm.UserError("already voted")

        if choice not in ["A", "B"]:
            raise gl.vm.UserError("invalid choice")

        if sender not in self.user_profiles:
            self.user_profiles[sender] = UserProfile(
                total_score=u256(0),
                votes_count=u256(0)
            )
            self.users.append(sender)

        vote = Vote(
            voter=sender,
            choice=choice,
            reason=reason,
            score=u256(0)
        )

        if topic_id not in self.topic_votes:
            self.topic_votes[topic_id] = []

        self.topic_votes[topic_id].append(vote)
        self.voted[vote_key] = True

    @gl.public.write
    def resolve_topic(
        self,
        topic_id: u256
    ):
       
        topic_idx = -1
        for i, t in enumerate(self.topics):
            if t.id == topic_id:
                topic_idx = i
                break
                
        if topic_idx == -1:
            raise gl.vm.UserError("Topic not found")
            
        if self.topics[topic_idx].resolved:
            raise gl.vm.UserError("Topic already resolved")

        if topic_id not in self.topic_votes or len(self.topic_votes[topic_id]) == 0:
             raise gl.vm.UserError("No votes to resolve")

        votes = self.topic_votes[topic_id]
        
       
        votes_to_judge = votes[:50] 
        expected_scores_count = len(votes_to_judge)

        votes_json = []
        for v in votes_to_judge:
            votes_json.append({
                "choice": v.choice,
                "reason": v.reason
            })

        payload = json.dumps(votes_json)

        def leader_fn():
            prompt = f"""
            You are an expert debate judge.

            Topic votes:
            {payload}

            For every argument score 0-100.
            Then decide winner A or B.

            Return JSON exactly like this:
            {{
            "winner":"A",
            "scores":[80,90,50]
            }}
            """
            raw = gl.nondet.exec_prompt(prompt)
            raw = raw.replace("```json", "")
            raw = raw.replace("```", "")
            return raw

        def validator_fn(result):
            if not isinstance(result, gl.vm.Return):
                return False
            try:
                data = json.loads(result.calldata)
                
                if data.get("winner") not in ["A", "B"]:
                    return False
                    
            
                if "scores" not in data or len(data["scores"]) != expected_scores_count:
                    return False
                    
                return True
            except:
                return False

        raw = gl.vm.run_nondet_unsafe(
            leader_fn,
            validator_fn
        )

        data = json.loads(raw)
        winner = data["winner"]
        scores = data["scores"]

        for i, vote in enumerate(votes_to_judge):
            score = int(scores[i])
            vote.score = u256(score)

            if vote.voter not in self.user_profiles:
                self.user_profiles[vote.voter] = UserProfile(
                    total_score=u256(0),
                    votes_count=u256(0)
                )

            profile = self.user_profiles[vote.voter]
            profile.total_score += u256(score)
            profile.votes_count += u256(1)

    
        self.topics[topic_idx].resolved = True
        self.topics[topic_idx].winner = winner

    @gl.public.view
    def get_user_score(
        self,
        user: str
    ) -> dict:
        addr = Address(user)
        if addr not in self.user_profiles:
            return {
                "score": 0,
                "votes": 0
            }

        profile = self.user_profiles[addr]
        return {
            "score": int(profile.total_score),
            "votes": int(profile.votes_count)
        }

    @gl.public.view
    def get_topic_votes(self, topic_id: u256) -> list:
        if topic_id not in self.topic_votes:
            return []

        result = []
        votes = self.topic_votes[topic_id]

        for vote in votes:
            result.append({
                "voter": str(vote.voter.as_hex),
                "choice": str(vote.choice),
                "reason": str(vote.reason),
                "score": int(vote.score)
            })

        
        return result

    @gl.public.view
    def get_leaderboard(self) -> list:
        leaderboard = []

        for user in self.users:
            profile = self.user_profiles[user]

            average = 0
            if int(profile.votes_count) > 0:
                average = int(profile.total_score) // int(profile.votes_count)

            leaderboard.append({
                "address": str(user.as_hex),
                "score": int(profile.total_score),
                "votes": int(profile.votes_count),
                "average": average
            })

        leaderboard.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return leaderboard[:10]

    @gl.public.view
    def get_platform_stats(self) -> dict:
        total_votes = 0

        for topic_id in self.topic_votes:
            total_votes += len(self.topic_votes[topic_id])

        return {
            "round": int(self.current_round),
            "topics": len(self.topics),
            "users": len(self.users),
            "votes": total_votes
        }
