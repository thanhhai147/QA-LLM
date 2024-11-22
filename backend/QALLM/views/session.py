from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from ..models.user import User
from ..models.session import Session
from ..models.chat import Chat

class CreateSessionAPIView(GenericAPIView):
    def post(self, request):
        data = request.data
        try:
            user_id = data['user_id']
        except:
            return Response(
                {
                    "success": False,
                    "message": "Thông tin phiên không hợp lệ"
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

class GetSessionByUserIdAPIView(GenericAPIView):
    def get(self, request):
        params = request.query_params
        try:
            user_id = params['user_id']
        except:
            return Response(
                {
                    "success": False,
                    "message": "Thông tin phiên không hợp lệ"
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
            session_instances = Session.objects.filter(user_id=user_id)
            session_ids = [session.session_id for session in session_instances]
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
                "message": "Lấy thành công phiên",
                "data": {
                    "user_id": user_id,
                    "session_ids": session_ids
                }
            }, 
            status=status.HTTP_200_OK
        )
      
class DeleteSessionAPIView(GenericAPIView):
    def post(self, request):
        data = request.data
        try:
            session_id = data['session_id']
        except:
            return Response(
                {
                    "success": False,
                    "message": "Thông tin phiên không hợp lệ"
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if not session_id:
            return Response(
                {
                    "success": False,
                    "message": "Mã phiên không hợp lệ"
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            session_instance = Session.objects.get(session_id=session_id)
            session_instance.delete()
        except Session.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Phiên không tồn tại"
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
        
        return Response(
            {
                "success": True,
                "message": "Xóa thành công phiên"
            }, 
            status=status.HTTP_200_OK
        )