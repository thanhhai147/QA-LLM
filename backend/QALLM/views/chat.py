from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from ..models.session import Session
from ..models.chat import Chat

class CreateChatAPIView(GenericAPIView):
    def post(self, request):
        data = request.data
        try:
            session_id = data['session_id']
            user_ask = data['user_ask']
        except:
            return Response(
                {
                    "success": False,
                    "message": "Thông tin trò chuyện không hợp lệ"
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
        
        if not user_ask:
            return Response(
                {
                    "success": False,
                    "message": "Câu hỏi không hợp lệ"
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            chat_position = Chat.objects.get(session_id=session_id).count() + 1
        except Chat.DoesNotExist:
            chat_position = 1
        except:
            return Response(
                {
                    "success": False,
                    "message": "Lỗi Database"
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        print(chat_position)
        bot_answer = ""
        try:
            session_instance = Session.objects.get(session_id=session_id)
            chat_instance = Chat(session_id=session_instance, chat_position=chat_position, user_ask=user_ask, bot_answer=bot_answer)
            chat_instance.save()
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
                "message": "Tạo thành công trò chuyện mới",
                "data": {
                    "chat_id": chat_instance.chat_id,
                    "session_id": session_id,
                    "chat_position": chat_position,
                    "user_ask": user_ask,
                    "bot_answer": bot_answer
                }
            }, 
            status=status.HTTP_200_OK
        )
    
class GetChatAPIView(GenericAPIView):
    def get(self, request):
        params = request.query_params
        try:
            chat_id = params['chat_id']
        except:
            return Response(
                {
                    "success": False,
                    "message": "Thông tin trò chuyện không hợp lệ"
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if not chat_id:
            return Response(
                {
                    "success": False,
                    "message": "Mã trò chuyện không hợp lệ"
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            chat_instance = Chat.objects.get(chat_id=chat_id)
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
                "message": "Lấy thành công trò chuyện",
                "data": {
                    "chat_id": chat_instance.chat_id,
                    "session_id": chat_instance.session_id.session_id,
                    "chat_position": chat_instance.chat_position,
                    "user_ask": chat_instance.user_ask,
                    "bot_answer": chat_instance.bot_answer
                }
            }, 
            status=status.HTTP_200_OK
        )