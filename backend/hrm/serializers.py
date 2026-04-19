
from rest_framework import serializers 
from hrm.models import Department, LeaveRequest 
from hrm.models import Employee 




class DepartmentSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Department 
        fields = ['id', 'name', 'description']


class EmployeeSerializer(serializers.ModelSerializer):
    
    department_name = serializers.StringRelatedField(source='department', read_only=True)

    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        source='department',
        write_only=True
    )

    class Meta: 
        model = Employee 
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'department_name', 'department_id', 'is_manager', 'is_active', 'date_joined']
        


class LeaveRequestSerializer(serializers.ModelSerializer): 
    employee_name = serializers.StringRelatedField(source='employee', read_only=True)

    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        source='employee',
        write_only=True
    )

    class Meta: 
        model = LeaveRequest 
        fields = ['id', 'employee_name', 'employee_id', 'start_date', 'end_date', 'reason', 'status']