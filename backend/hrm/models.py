from django.db import models



class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True) 

    def __str__(self):
        return self.name 
    

class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    
    # Relationship to Department
    department = models.ForeignKey(Department, on_delete=models.PROTECT, null=True)
    
    is_manager = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True) # ADDED THIS LINE
    date_joined = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class LeaveRequest(models.Model):

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, default='PENDING', choices=STATUS_CHOICES)

    def __str__(self):
        return f"Leave Request by {self.employee.first_name} {self.employee.last_name} from {self.start_date} to {self.end_date} - {self.status}"