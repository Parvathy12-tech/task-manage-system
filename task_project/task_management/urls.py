from django.urls import path
from .views import *


urlpatterns = [

    # Pages

    path('', landing_page, name='landing_page'),

    path('dashboard/', dashboard, name='dashboard'),

    path('manage-users/', manage_users, name='manage_users'),

    path('add-task/', add_task, name='add_task'),

    path('edit-task/<int:id>/', edit_task, name='edit_task'),

    path('delete-task/<int:id>/', delete_task, name='delete_task'),

    path('view-tasks/', view_tasks, name='view_tasks'),

    path('admin-login/', admin_login, name='admin_login'),

    path('reports/', reports, name='reports'),

    path('navbar/', navbar, name='navbar'),

    path('add-user/', add_user, name='add_user'),

    path('edit-user/<int:id>/', edit_user, name='edit_user'),

    path('delete-user/<int:id>/', delete_user, name='delete_user'),

    path(
        'project-management/',
        project_management,
        name='project_management'
    ),
    path(
        "task-discussion/<int:id>/",
        views.task_discussion,
        name="task_discussion"
    ),
    path("comment/reply/<int:comment_id>/", views.reply_comment, name="reply_comment"),
    # APIs

    path('tasks/', task_list),

    path('dashboard-balance/', dashboard_balance),

    path('add-task-api/', add_task_api),

    path(
        'update-task-api/<int:pk>/',
        update_task_api
    ),

    path(
        'delete-task-api/<int:pk>/',
        delete_task_api
    ),

    path(
        'task-detail-api/<int:pk>/',
        task_detail_api
    ),

    path(
        'update-task-status/<int:pk>/',
        update_task_status_api
    ),

    path(
        'task-filter/',
        task_filter_api
    ),

    path("api/profile/me/", user_profile_api),

    path(
        'assign-task/<int:pk>/',
        assign_task_api
    ),

    path(
        'tasks-by-user/',
        tasks_by_user_api
    ),

    path(
        'task-count-by-user/',
        task_count_by_user_api
    ),

    path(
        'update-user-api/<int:pk>/',
        update_user_api
    ),

    path(
        'delete-user-api/<int:pk>/',
        delete_user_api
    ),
    path('api/login/', login_api),

    path("add-comment/", add_comment),
    path("task-comments/<int:task_id>/", get_task_comments),
    path("delete-comment/<int:id>/", delete_comment),
     path("api/tasks/completed/", completed_tasks),
     path("api/comment/reply/<int:comment_id>/", views.reply_comment_api),

]