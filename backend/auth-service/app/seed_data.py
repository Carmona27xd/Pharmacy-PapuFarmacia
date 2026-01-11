from passlib.context import CryptContext
from app.database import SessionLocal
from app.models import Role, User

def seed_roles():
    db = SessionLocal()
    try:
        # Check if roles already exist
        existing_roles = db.query(Role).filter(Role.name.in_(["employee", "administrator"])).all()
        existing_role_names = [role.name for role in existing_roles]

        roles_to_create = []
        if "administrator" not in existing_role_names:
            roles_to_create.append(Role(name="administrator"))
            
        if "employee" not in existing_role_names:
            roles_to_create.append(Role(name="employee"))

        if roles_to_create:
            db.add_all(roles_to_create)
            db.commit()
            print(f"✅ Seeded {len(roles_to_create)} new roles")
        else:
            print("✅ All roles already exist, skipping seeding.")
            
    except Exception as e:
        print(f"❌ Error seeding roles: {e}")
        db.rollback()
    finally:
        db.close()
        
def seed_users():
    db = SessionLocal()
    try:
        # Check if users already exists
        existing_admin = db.query(User).filter_by(username="admin").first()
        existing_employee = db.query(User).filter_by(username="employee").first()
        users_to_create = []
        # Setup password hashing
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        if existing_admin:
            print("✅ Admin user already exists, skipping seeding.")
        else:
            users_to_create.append(User(
                email="admin@example.com", full_name="Jhon Doe",username="admin", hashed_password=pwd_context.hash("Password123"), is_active=True, role_id=1))
        
        if existing_employee:
            print("✅ Employee user already exists, skipping seeding.")
        else:
            users_to_create.append(User(
                email="employee@example.com", full_name="Jane Smith",username="employee", hashed_password=pwd_context.hash("Password123"), is_active=True, role_id=2))
            
        if users_to_create:
            db.add_all(users_to_create)
            db.commit()
            print(f"✅ Seeded {len(users_to_create)} new users")
        else:
            print("✅ All usres already exist, skipping seeding.")
            
    except Exception as e:
        print(f"❌ Error seeding users: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_roles()
    seed_users()