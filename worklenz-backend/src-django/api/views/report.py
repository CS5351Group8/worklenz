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
    taskListV3 = serializers.DictField(required=False, allow_null=True)
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

    def normalize_list(value):
        """Convert None / dict / list into a uniform list."""
        if not value:
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, dict):
            if isinstance(value.get("items"), list):
                return value["items"]
            if isinstance(value.get("data"), list):
                return value["data"]
            return [value]
        return []

    project = data.get("project") or {}
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

    overview_stats = data.get("overviewStats") or {}

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

    task_status = normalize_list(data.get("taskStatusCounts"))

    if y < 120:
        pdf.showPage()
        y = height - 50

    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Tasks by Status")
    y -= 18
    pdf.setFont("Helvetica", 9)

    for item in task_status[:15]:
        name = safe_get(item, "status", safe_get(item, "name", "Unknown"))
        count = safe_get(item, "count", "N/A")

        pdf.drawString(60, y, f"{name}: {count}")
        y -= 12

        if y < 80:
            pdf.showPage()
            y = height - 50
            pdf.setFont("Helvetica", 9)

    members = normalize_list(data.get("membersOverview"))

    if members:
        if y < 120:
            pdf.showPage()
            y = height - 50

        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(50, y, "Team Members")
        y -= 18
        pdf.setFont("Helvetica", 9)

        for m in members[:20]:
            name = safe_get(m, "full_name", safe_get(m, "name", "Unknown"))
            assigned = safe_get(m, "assigned_tasks", "N/A")
            completed = safe_get(m, "completed_tasks", "N/A")

            pdf.drawString(60, y, f"{name} — Assigned: {assigned}, Completed: {completed}")
            y -= 12

            if y < 80:
                pdf.showPage()
                y = height - 50
                pdf.setFont("Helvetica", 9)

    if y < 60:
        pdf.showPage()
        y = height - 50

    pdf.setFont("Helvetica-Oblique", 8)
    pdf.drawString(50, 40, "Generated by Django microservice")

    pdf.showPage()
    pdf.save()

    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


class ReportView(APIView):
    http_method_names = ["post"]

    def post(self, request, filetype, *args, **kwargs):
        allowed = ["pdf"]
        if filetype not in allowed:
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
