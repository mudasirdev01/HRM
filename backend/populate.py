# import os
# import django

# # Setup Django environment
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
# django.setup()

# from hrm.models import Department

# def run():
#     departments = [
#         {"name": "Human Resources", "description": "Handles recruitment and employee relations"},
#         {"name": "Finance", "description": "Manages company finances and accounts"},
#         {"name": "IT", "description": "Handles technology and infrastructure"},
#         {"name": "Marketing", "description": "Promotes products and brand"},
#         {"name": "Sales", "description": "Handles client sales and revenue"},
#         {"name": "Operations", "description": "Manages daily business operations"},
#         {"name": "Customer Support", "description": "Handles customer queries and issues"},
#         {"name": "Legal", "description": "Handles legal matters and compliance"},
#         {"name": "Research & Development", "description": "Focuses on innovation and product development"},
#         {"name": "Administration", "description": "Manages office administration tasks"},
#     ]

#     for dept in departments:
#         obj, created = Department.objects.get_or_create(
#             name=dept["name"],
#             defaults={"description": dept["description"]}
#         )
#         if created:
#             print(f"Created: {obj.name}")
#         else:
#             print(f"Already exists: {obj.name}")

# if __name__ == "__main__":
#     run()


import os
import django
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from hrm.models import Employee, Department

def run():
    departments = list(Department.objects.all())

    if not departments:
        print("❌ No departments found. Run populate.py first.")
        return

    employees = [
        ("John", "Doe", "john@example.com"),
        ("Jane", "Smith", "jane@example.com"),
        ("Mike", "Johnson", "mike@example.com"),
        ("Emily", "Davis", "emily@example.com"),
        ("Robert", "Brown", "robert@example.com"),
        ("Linda", "Wilson", "linda@example.com"),
        ("David", "Taylor", "david@example.com"),
        ("Sophia", "Anderson", "sophia@example.com"),
        ("Chris", "Thomas", "chris@example.com"),
        ("Olivia", "Jackson", "olivia@example.com"),
    ]

    for first, last, email in employees:
        dept = random.choice(departments)

        obj, created = Employee.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first,
                "last_name": last,
                "phone_number": "9876543210",
                "department": dept,
                "is_manager": random.choice([True, False]),
                "is_active": True
            }
        )

        if created:
            print(f"✅ Created: {obj.first_name} ({dept.name})")
        else:
            print(f"⚠️ Already exists: {obj.first_name}")

if __name__ == "__main__":
    run()