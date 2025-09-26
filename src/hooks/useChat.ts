import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../services/api';
import { Message, Conversation, SendMessageRequest } from '../types';

export const useConversationMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['conversation', conversationId, 'messages'],
    queryFn: () => chatApi.getConversationMessages(conversationId),
    enabled: !!conversationId,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always fresh for chat messages
  });
};

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SendMessageRequest) => 
      chatApi.sendMessage(conversationId, request),
    onSuccess: () => {
      // Refetch messages after sending
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId, 'messages']
      });
    },
  });
};

export const useCreateConversation = () => {
  return useMutation({
    mutationFn: chatApi.createConversation,
  });
};

export const useUserConversations = () => {
  return useQuery({
    queryKey: ['user', 'conversations'],
    queryFn: () => chatApi.getUserConversations(),
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
  });
};

