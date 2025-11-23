import io

from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import status, serializers
from rest_framework.response import Response

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4


class ProjectReportSerializer(serializers.Serializer):
    projectId = serializers.CharField(required=False, allow_blank=True)
    project = serializers.DictField(required=False, allow_null=True)
    overviewStats = serializers.DictField(required=False, allow_null=True)
    overviewInsights = serializers.DictField(required=False, allow_null=True)
    reportingProjectInfo = serializers.DictField(required=False, allow_null=True)
    membersOverview = serializers.DictField(required=False, allow_null=True)
    reportingMembers = serializers.DictField(required=False, allow_null=True)
    memberStats = serializers.DictField(required=False, allow_null=True)
    taskStatusCounts = serializers.DictField(required=False, allow_null=True)
    priorityOverview = serializers.DictField(required=False, allow_null=True)
    deadlineStats = serializers.DictField(required=False, allow_null=True)
    overdueTasks = serializers.DictField(required=False, allow_null=True)
    completedEarlyTasks = serializers.DictField(required=False, allow_null=True)
    completedLateTasks = serializers.DictField(required=False, allow_null=True)
    lastUpdatedTasks = serializers.DictField(required=False, allow_null=True)
    projectLogs = serializers.DictField(required=False, allow_null=True)
    timeSheets = serializers.DictField(required=False, allow_null=True)
    estimatedVsActual = serializers.DictField(required=False, allow_null=True)


def generate_pdf_report(data: dict) -> bytes:
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    def safe_get(d, key, default=None):
        if isinstance(d, dict):
            return d.get(key, default)
        return default

    def unwrap_body(value):
        if isinstance(value, dict) and "body" in value:
            return value.get("body")
        return value

    def normalize_list(value):
        if not value:
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, dict):
            items = value.get("items")
            if isinstance(items, list):
                return items
            data_list = value.get("data")
            if isinstance(data_list, list):
                return data_list
            return [value]
        return []

    project_resp = data.get("project")
    project = unwrap_body(project_resp) or {}

    project_id = data.get("projectId") or safe_get(project, "id", "N/A")
    project_name = safe_get(project, "name", "N/A")
    project_status = safe_get(project, "status", "N/A")
    project_category = safe_get(project, "category_name", "N/A")

    y = height - 50

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, y, "Project Report")
    y -= 25

    pdf.setFont("Helvetica", 10)
    pdf.drawString(50, y, f"Project ID: {project_id}")
    y -= 15
    pdf.drawString(50, y, f"Project Name: {project_name}")
    y -= 15
    pdf.drawString(50, y, f"Status: {project_status}")
    y -= 15
    pdf.drawString(50, y, f"Category: {project_category}")
    y -= 25

    overview_stats_resp = data.get("overviewStats")
    overview_stats = unwrap_body(overview_stats_resp) or {}

    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Overview")
    y -= 18
    pdf.setFont("Helvetica", 9)

    for key, value in overview_stats.items():
        pdf.drawString(60, y, f"{key}: {value}")
        y -= 12
        if y < 80:
            pdf.showPage()
            y = height - 50
            pdf.setFont("Helvetica", 9)

    task_status_resp = data.get("taskStatusCounts")
    task_status_body = unwrap_body(task_status_resp)
    task_status_counts = normalize_list(task_status_body)

    if y < 120:
        pdf.showPage()
        y = height - 50

    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Tasks by Status")
    y -= 18
    pdf.setFont("Helvetica", 9)

    for item in task_status_counts[:15]:
        name = safe_get(item, "status", safe_get(item, "name", "Unknown"))
        count = safe_get(item, "count", safe_get(item, "y", "N/A"))

        pdf.drawString(60, y, f"{name}: {count}")
        y -= 12

        if y < 80:
            pdf.showPage()
            y = height - 50
            pdf.setFont("Helvetica", 9)

    members_overview_resp = data.get("membersOverview")
    members_overview_body = unwrap_body(members_overview_resp)
    members = normalize_list(members_overview_body)

    if members:
        if y < 120:
            pdf.showPage()
            y = height - 50

        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(50, y, "Team Members (Overview)")
        y -= 18
        pdf.setFont("Helvetica", 9)

        for m in members[:20]:
            name = safe_get(m, "full_name", safe_get(m, "name", "Unknown"))
            assigned = safe_get(m, "project_task_count", safe_get(m, "task_count", "N/A"))
            completed = safe_get(m, "done_task_count", "N/A")

            pdf.drawString(
                60,
                y,
                f"{name} — Assigned: {assigned}, Completed: {completed}",
            )
            y -= 12

            if y < 80:
                pdf.showPage()
                y = height - 50
                pdf.setFont("Helvetica", 9)

    overdue_tasks_resp = data.get("overdueTasks")
    overdue_tasks_body = unwrap_body(overdue_tasks_resp)
    overdue_tasks = normalize_list(overdue_tasks_body)

    if overdue_tasks:
        if y < 120:
            pdf.showPage()
            y = height - 50

        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(50, y, "Overdue Tasks")
        y -= 18
        pdf.setFont("Helvetica", 9)

        for t in overdue_tasks[:30]:
            title = safe_get(t, "name", safe_get(t, "title", "Untitled task"))
            assignee = safe_get(t, "assignee_name", safe_get(t, "assignee", "N/A"))

            pdf.drawString(60, y, f"- {title} (Assignee: {assignee})")
            y -= 12

            if y < 80:
                pdf.showPage()
                y = height - 50
                pdf.setFont("Helvetica", 9)

    if y < 60:
        pdf.showPage()
        y = height - 50

    pdf.setFont("Helvetica-Oblique", 8)
    pdf.drawString(50, 40, "Generated by WorkPrism")

    pdf.showPage()
    pdf.save()

    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


class ReportView(APIView):
    http_method_names = ["post"]

    def post(self, request, filetype, *args, **kwargs):
        allowed_filetypes = ["pdf"]
        if filetype not in allowed_filetypes:
            return Response(
                {"detail": "Unsupported file type."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ProjectReportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        pdf_bytes = generate_pdf_report(data)

        filename = f"project-report-{data.get('projectId', 'project')}.pdf"

        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response
