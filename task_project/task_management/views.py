from asyncio import tasks
import email
from unittest import result
from urllib import request

from django.shortcuts import redirect, render
from . import views
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login
from .models import Task, TaskComment
from .serializers import TaskCommentSerializer, TaskSerializer

from rest_framework.decorators import api_view

from rest_framework import status
from django.contrib import messages
from .models import UserProfile
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.contrib.auth.decorators import login_required
#email
from django.core.mail import send_mail
from django.shortcuts import render, get_object_or_404
from .models import Task, TaskComment
from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
# Create your views here.
def dashboard(request):
    

    # counts
    total_users = User.objects.count()
    total_tasks = Task.objects.count()

    completed_tasks = Task.objects.filter(status="Completed").count()
    pending_tasks = Task.objects.filter(status="Pending").count()
    progress_tasks = Task.objects.filter(status="In Progress").count()

    # recent tasks (latest 5)
    recent_tasks = Task.objects.all().order_by("-id")[:5]
    context = {
        "total_users": total_users,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "progress_tasks": progress_tasks,
        "recent_tasks": recent_tasks,
    }
    return render(request, 'admin-dashboard.html', context)
def manage_users(request):

    users = User.objects.filter(
        is_superuser=False
    ).order_by("id")

    user_data = []

    for user in users:

        profile = UserProfile.objects.filter(
            user=user
        ).first()

        user_data.append({

            "id": user.id,

            "name": f"{user.first_name} {user.last_name}",

            "email": user.email,

            "role": profile.role if profile else "user",

            "image": profile.profile_image.url
            if profile and profile.profile_image
            else None,

        })

    return render(
        request,
        "manage-users.html",
        {
            "users": user_data
        }
    )


def add_task(request):

    users = User.objects.all()

    if request.method == "POST":

        title = request.POST.get("title")
        description = request.POST.get("description")
        assigned_to = request.POST.get("assigned_to")
        
        deadline = request.POST.get("deadline")
        project = request.POST.get("project")

        assigned_user = None

        if assigned_to:
            assigned_user = User.objects.get(id=assigned_to)

        Task.objects.create(
    title=title,
    description=description,
    assigned_to=assigned_user,
    status=status,
    deadline=deadline,
    project=project
)

        return redirect("project_management")

    return render(request, "add_task.html", {"users": users})
from django.utils.timezone import now

def reports(request):

    users = User.objects.filter(is_superuser=False)

    report_data = []

    for user in users:

        total_tasks = Task.objects.filter(
            assigned_to=user
        ).count()

        completed_tasks = Task.objects.filter(
            assigned_to=user,
            status="Completed"
        ).count()

        pending_tasks = Task.objects.filter(
            assigned_to=user,
            status="Pending"
        ).count()

        progress_tasks = Task.objects.filter(
            assigned_to=user,
            status="In Progress"
        ).count()

        overdue_tasks = Task.objects.filter(
            assigned_to=user,
            deadline__lt=now().date()
        ).exclude(
            status="Completed"
        ).count()

        report_data.append({
            "user": user,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "progress_tasks": progress_tasks,
            "overdue_tasks": overdue_tasks,
        })

    context = {
        "report_data": report_data
    }

    return render(
        request,
        "reports.html",
        context
    )
def admin_login(request):

    if request.method == "POST":

        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)   # ✅ FIX HERE
            return redirect("/dashboard/")

        else:
            messages.error(request, "Invalid Credentials")

    return render(request, "admin-login.html")


def landing_page(request):
    return render(request, 'landing-page.html') 
def navbar(request):
    return render(request, 'navbar.html')
def edit_task(request, id):

    task = Task.objects.get(id=id)

    users = User.objects.filter(is_superuser=False)

    if request.method == "POST":

        task.title = request.POST.get("title")

        task.description = request.POST.get("description")

        assigned_to = request.POST.get("assigned_to")

        if assigned_to:
            task.assigned_to = User.objects.get(id=assigned_to)

        task.status = request.POST.get("status")

        task.deadline = request.POST.get("deadline")

        task.project = request.POST.get("project")

        task.save()

        return redirect("project_management")

    context = {
        "task": task,
        "users": users
    }

    return render(request, "edit_task.html", context)

def delete_task(request, id):

    task = Task.objects.get(id=id)

    task.delete()

    return redirect('project_management')
def view_tasks(request):
    return render(request, 'view_task.html')
def add_user(request):

    if request.method == "POST":
        profile_image = request.FILES.get("profile_image")

        full_name = request.POST.get("full_name")
        email = request.POST.get("email")
        password = request.POST.get("password")
        phone = request.POST.get("phone")
        role = request.POST.get("role")
        address = request.POST.get("address")

        # Split full name
        name_parts = full_name.split(" ", 1)

        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        # Create Django User
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_active=True
        )

        # Create User Profile
        UserProfile.objects.create(
            user=user,
            phone=phone,
            role=role,
            status="active",
            address=address,
            profile_image=profile_image
)

        return redirect("manage_users")

    return render(request, "add_user.html")

def edit_user(request, id):

    user = User.objects.get(id=id)

    profile = UserProfile.objects.filter(
        user=user
    ).first()

    # create profile if not exists
    if not profile:

        profile = UserProfile.objects.create(
            user=user
        )

    if request.method == "POST":

        full_name = request.POST.get("full_name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        role = request.POST.get("role")
        status = request.POST.get("status")
        address = request.POST.get("address")

        profile_image = request.FILES.get(
            "profile_image"
        )

        # split name
        name_parts = full_name.split(" ", 1)

        user.first_name = name_parts[0]

        user.last_name = (
            name_parts[1]
            if len(name_parts) > 1
            else ""
        )

        user.email = email
        user.username = email

        # active / disabled
        if status == "active":
            user.is_active = True
        else:
            user.is_active = False

        user.save()

        # profile update
        profile.phone = phone
        profile.role = role
        profile.status = status
        profile.address = address

        # image update
        if profile_image:
            profile.profile_image = profile_image

        profile.save()

        return redirect("manage_users")

    context = {

        "user_data": user,

        "profile": profile

    }

    return render(
        request,
        "edit_user.html",
        context
    )
def project_management(request):

    tasks = Task.objects.all()

    search = request.GET.get("search")
    user_id = request.GET.get("user")
    project = request.GET.get("project")
    status_filter = request.GET.get("status")

    # SEARCH (title + description)
    if search:
        tasks = tasks.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search)
        )

    # FILTER BY USER
    if user_id:
        tasks = tasks.filter(assigned_to_id=user_id)

    # FILTER BY PROJECT
    if project:
        tasks = tasks.filter(project__icontains=project)

    # FILTER BY STATUS
    if status_filter:
        tasks = tasks.filter(status=status_filter)

    context = {
        "tasks": tasks,
        "users": User.objects.filter(is_superuser=False),
        "projects": Task.objects.values_list("project", flat=True).distinct(),

        "total_tasks": tasks.count(),
        "completed_tasks": tasks.filter(status="Completed").count(),
        "pending_tasks": tasks.filter(status="Pending").count(),
        "progress_tasks": tasks.filter(status="In Progress").count(),
    }

    return render(request, "project-management.html", context)

def delete_user(request, id):

    user = User.objects.get(id=id)

    user.delete()

    return redirect("manage_users")




def task_discussion(request, id):

    # GET TASK
    task = get_object_or_404(
        Task,
        id=id
    )

    # GET COMMENTS
    comments = TaskComment.objects.filter(
        task=task
    ).order_by("-id")

    context = {
        "task": task,
        "comments": comments
    }

    return render(
        request,
        "task_discussion.html",
        context
    )

def reply_comment(request, comment_id):
    if request.method == "POST":
        comment = get_object_or_404(TaskComment, id=comment_id)

        comment.admin_reply = request.POST.get("admin_reply")
        comment.replied_by = request.user
        comment.replied_at = timezone.now()   # ✅ works now

        comment.save()

    return redirect("task_discussion", id=comment.task.id)



#API CREATIONS

@api_view(['GET'])

def task_list(request):

    tasks = Task.objects.all()

    serializer = TaskSerializer(tasks, many=True)

    return Response(serializer.data)



from django.contrib.auth import get_user_model
@api_view(['POST'])
@permission_classes([AllowAny])
def login_api(request):

    username = request.data.get("username")
    password = request.data.get("password")

    try:
        user_obj = User.objects.get(email=username)
        username = user_obj.username
    except User.DoesNotExist:
        pass

    user = authenticate(request, username=username, password=password)

    if user is not None:

        if not user.is_active:
            return Response({"error": "Account Disabled"}, status=403)

        return Response({
            "message": "Login Successful",
            "user": {
                "id": user.id,
                "name": user.get_full_name(),
                "email": user.email
            }
        })

    return Response({"error": "Invalid Credentials"}, status=401)
@api_view(['GET'])

def dashboard_balance(request):

    total_tasks = Task.objects.count()

    completed_tasks = Task.objects.filter(
        status="Completed"
    ).count()

    pending_tasks = Task.objects.filter(
        status="Pending"
    ).count()

    progress_tasks = Task.objects.filter(
        status="In Progress"
    ).count()


    data = {

        "total_tasks": total_tasks,

        "completed_tasks": completed_tasks,

        "pending_tasks": pending_tasks,

        "progress_tasks": progress_tasks

    }

    return Response(data)


@api_view(['POST'])

def add_task_api(request):

    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                "message":"Task Added Successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['PUT'])

def update_task_api(request, pk):

    try:

        task = Task.objects.get(id=pk)

    except Task.DoesNotExist:

        return Response(
            {"error":"Task Not Found"},
            status=status.HTTP_404_NOT_FOUND
        )


    serializer = TaskSerializer(
        task,
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response({
            "message":"Task Updated Successfully",
            "data": serializer.data
        })

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )



@api_view(['DELETE'])
def delete_task_api(request, pk):

    try:
        task = Task.objects.get(id=pk)
    except Task.DoesNotExist:
        return Response(
            {"error": "Task not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    task.delete()

    return Response(
        {"message": "Task deleted successfully"},
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def task_detail_api(request, pk):

    try:
        task = Task.objects.get(id=pk)
    except Task.DoesNotExist:
        return Response(
            {"error": "Task not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = TaskSerializer(task)

    return Response(serializer.data)


@api_view(['PATCH'])
def update_task_status_api(request, pk):

    try:
        task = Task.objects.get(id=pk)
    except Task.DoesNotExist:
        return Response(
            {"error": "Task not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    new_status = request.data.get("status")

    if not new_status:
        return Response(
            {"error": "Status is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    task.status = new_status
    task.save()

    return Response({
        "message": "Task status updated successfully",
        "id": task.id,
        "status": task.status
    })



@api_view(['GET'])
def task_filter_api(request):

    status_filter = request.GET.get('status')
    search = request.GET.get('search')

    tasks = Task.objects.all()

    # Filter by status
    if status_filter:
        tasks = tasks.filter(status=status_filter)

    # Search by title
    if search:
        tasks = tasks.filter(title__icontains=search)

    serializer = TaskSerializer(tasks, many=True)

    return Response(serializer.data)



@api_view(["GET"])
def user_profile_api(request):

    email = request.GET.get("email")

    try:
        user = User.objects.get(email=email)
        profile = user.userprofile

    except:
        return Response({"error": "User not found"}, status=404)

    return Response({
        "name": user.first_name,
        "email": user.email,
        "phone": profile.phone,
        "address": profile.address,
        "role": profile.role,
        "status": profile.status,
        "profile_image": profile.profile_image.url if profile.profile_image else None,
    })

@api_view(['PATCH'])
def assign_task_api(request, pk):

    try:
        task = Task.objects.get(id=pk)

    except Task.DoesNotExist:
        return Response(
            {"error": "Task not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    assigned_to = request.data.get("assigned_to")

    if not assigned_to:
        return Response(
            {"error": "assigned_to is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(id=assigned_to)

    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    task.assigned_to = user
    task.save()

    return Response({
        "message": "Task assigned successfully",
        "task_id": task.id,
        "assigned_to": user.username
    })



@api_view(['GET'])
def tasks_by_user_api(request):

    email = request.GET.get("user")

    if not email:
        return Response({"error": "User email required"})

    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:
        return Response({"error": "User not found"})

    tasks = Task.objects.filter(
        assigned_to=user   # OR assigned_to_id=user.id
    )

    serializer = TaskSerializer(tasks, many=True)

    return Response(serializer.data)




@api_view(['GET'])
def task_count_by_user_api(request):

    tasks = Task.objects.select_related('assigned_to')

    result = {}

    for task in tasks:

        user = (
        task.assigned_to.get_full_name()
    if task.assigned_to
    else "Unassigned"
)
    

    result[user] = result.get(user, 0) + 1

    return Response(result)


#delete user
@api_view(['DELETE'])
def delete_user_api(request, pk):

    try:
        user = User.objects.get(id=pk)

    except User.DoesNotExist:

        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    user.delete()

    return Response({
        "message": "User deleted successfully"
    })


#edit user
@api_view(['PUT'])
def update_user_api(request, pk):

    try:
        user = User.objects.get(id=pk)

    except User.DoesNotExist:

        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    profile = UserProfile.objects.filter(user=user).first()

    full_name = request.data.get("full_name")
    email = request.data.get("email")
    phone = request.data.get("phone")
    role = request.data.get("role")
    user_status = request.data.get("status")
    address = request.data.get("address")

    # split full name
    if full_name:
        name_parts = full_name.split(" ", 1)

        user.first_name = name_parts[0]
        user.last_name = name_parts[1] if len(name_parts) > 1 else ""

    if email:
        user.email = email
        user.username = email

    user.save()

    if profile:

        profile.phone = phone
        profile.role = role
        profile.status = user_status
        profile.address = address

        profile.save()

    return Response({
        "message": "User updated successfully"
    })


@api_view(['POST'])
def add_comment(request):

    serializer = TaskCommentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Comment added successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_comment(request, id):

    try:
        comment = TaskComment.objects.get(id=id)
        comment.delete()
        return Response({"message": "Deleted successfully"})
    except TaskComment.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    
@api_view(['GET'])
def get_task_comments(request, task_id):

    comments = TaskComment.objects.filter(task_id=task_id).order_by("-id")

    serializer = TaskCommentSerializer(comments, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def completed_tasks(request):
    tasks = Task.objects.filter(status="Completed")
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)



def reply_comment_api(request, comment_id):

    comment = get_object_or_404(TaskComment, id=comment_id)

    reply_text = request.data.get("admin_reply")

    if not reply_text:
        return Response(
            {"error": "Reply text is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    comment.admin_reply = reply_text
    comment.replied_by = request.user
    comment.replied_at = timezone.now()
    comment.save()

    return Response({
        "message": "Reply added successfully",
        "data": TaskCommentSerializer(comment).data
    })