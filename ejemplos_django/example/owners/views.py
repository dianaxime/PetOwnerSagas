from django.shortcuts import render

# Create your views here.

from guardian.shortcuts import assign_perm
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from permissions.services import APIPermissionClassFactory
from owners.models import Owner
from owners.serializers import OwnerSerializer

class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
    permission_classes = (
        APIPermissionClassFactory(
            name='OwnerPermission',
            permission_configuration={
                'base': {
                    'create': lambda user, req: user.is_authenticated,
                    'list': lambda user, req: user.is_authenticated,
                    #'delete': lambda user, req: user.is_authenticated,
                },
                'instance': {
                    'retrieve': 'owners.view_owner',
                    'update_Owner': lambda user, req: user.is_authenticated,
                    'destroy': 'owners.delete_owner',
                    'update': lambda user, req: user.is_authenticated,
                    'partial_update': 'owners.change_owner',
                    'fetch_Owners': lambda user, req: user.is_authenticated,
                    #'notify': evaluar_notify,
                    # 'update_permissions': 'users.add_permissions'
                    # 'archive_all_students': phase_user_belongs_to_school,
                    # 'add_clients': True,
                }
            }
        ),
    )

    def perform_create(self, serializer):
        owner = serializer.save()
        user = self.request.user
        assign_perm('owners.change_owner', user, owner)
        assign_perm('owners.view_owner', user, owner)
        assign_perm('owners.delete_owner', user, owner)
        return Response(serializer.data)

    #@action(detail = True, methods=['delete'])
    #def delete_Owner(self, request, pk=None):
        #owner = self.get_object()
        #print(owner.name)
        #owner.delete()
        #return Response({
         #   'status': 'ok'
        #})

    @action(detail = True, methods=['patch'])
    def update_Owner(self, request, pk=None):
        #owner = serializer.save()
        owner = self.get_object()
        #owner.name = request.data.get('name')
        #print(owner.name)
        #owner.save()
        return Response(OwnerSerializer(owner).data)

    @action(detail = True, methods=['get'])
    def fetch_Owners(self, request):
        return Response([OwnerSerializer(owner).data for owner in Owner.objects.all()])

