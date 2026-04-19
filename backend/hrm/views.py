from hrm.serializers import DepartmentSerializer, LeaveRequestSerializer 
from hrm.models import Department, LeaveRequest 
from hrm.serializers import EmployeeSerializer 
from hrm.models import Employee
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import ProtectedError



class DepartmentViewSet(viewsets.ModelViewSet): 
    queryset = Department.objects.all() 
    serializer_class = DepartmentSerializer 


    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {"error": "Cannot delete department with employees"},
                status=400
            )

class EmployeeViewSet(viewsets.ModelViewSet): 
    queryset = Employee.objects.all() 
    serializer_class = EmployeeSerializer 



class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer 

    

    

    