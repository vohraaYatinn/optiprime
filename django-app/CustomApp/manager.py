from UsersDetails.models import UsersDetails

class CustomManager:

    @staticmethod
    def check_if_admin_exists(email):
        check_login = UsersDetails.objects.filter(email=email).exists()
        return check_login



