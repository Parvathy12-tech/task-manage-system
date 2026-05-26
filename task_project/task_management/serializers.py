from profile import Profile

from rest_framework import serializers
from .models import Task, TaskComment

class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = "__all__"

class TaskCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaskComment
        fields = [
            "id",
            "task",
            "user",
            "comment",
            "created_at",
            "admin_reply",
            "replied_by",
            "replied_at"
        ]
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"