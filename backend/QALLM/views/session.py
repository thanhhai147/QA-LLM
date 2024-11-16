from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from ..models.user import User
from ..models.session import Session

class CreateSessionAPIView(GenericAPIView):
    def post(self, request):
        data = request.data
        try:
            user_id = data['user_id']
        except:
            return Response(
                {
                    "success": False,
                    "message": "Thông tin người dùng không hợp lệ"
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if not user_id:
            return Response(
                {
                    "success": False,
                    "message": "Mã người dùng không hợp lệ"
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_instance = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Người dùng không tồn tại"
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except:
            return Response(
                {
                    "success": False,
                    "message": "Lỗi Database"
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        try:
            session_instance = Session(user_id=user_instance)
            session_instance.save()
        except:
            return Response(
                {
                    "success": False,
                    "message": "Lỗi Database"
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(
            {
                "success": True,
                "message": "Tạo thành công phiên mới",
                "data": {
                    "user_id": user_id,
                    "session_id": session_instance.session_id
                }
            }, 
            status=status.HTTP_200_OK
        )