'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, MapPin, User, Mail, Phone, Map, Key, Shield } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CUSTOMER' as 'ADMIN' | 'CUSTOMER',
    is_active: true,
    created_at: '',
  });
  const [location, setLocation] = useState<{
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  // Fetch user details and location on load
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      // Fetch user details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Fetch location
      const { data: locationData, error: locationError } = await supabase
        .from('locations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (locationError && locationError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw locationError;
      }

      setUserDetails({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role,
        is_active: userData.is_active,
        created_at: userData.created_at,
      });

      if (locationData) {
        setLocation({
          address: locationData.address,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('users')
        .update({
          name: userDetails.name,
          phone: userDetails.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>Profile Information</CardTitle>
                    <Badge variant={userDetails.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {userDetails.role}
                    </Badge>
                  </div>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={isLoading}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="name"
                      value={userDetails.name}
                      onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing || isLoading}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={userDetails.email}
                      disabled={true}
                      className="pl-9 bg-gray-50"
                    />
                  </div>
                  <p className="text-sm text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="phone"
                      type="tel"
                      value={userDetails.phone}
                      onChange={(e) => setUserDetails(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing || isLoading}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Account Information</Label>
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-sm text-gray-500">
                        {new Date(userDetails.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Account Status</p>
                      <p className="text-sm text-gray-500">
                        {userDetails.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Delivery Location</CardTitle>
                  <CardDescription>
                    Your current delivery address
                  </CardDescription>
                </div>
                <Link href="/profile/location">
                  <Button variant="outline">
                    <Map className="h-4 w-4 mr-2" />
                    Update Location
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {location ? (
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">{location.address}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No delivery location set</p>
                  <Link href="/profile/location">
                    <Button variant="link" className="mt-2">
                      Set your delivery location
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => router.push('/auth/reset-password')}>
                  Change Password
                </Button>
              </div>

              {userDetails.role === 'ADMIN' && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-blue-700">Admin Access</h3>
                      <p className="text-sm text-blue-500">You have administrative privileges</p>
                    </div>
                  </div>
                  <Link href="/admin">
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                      Go to Admin Panel
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 text-red-500">⚠️</div>
                  <div>
                    <h3 className="font-medium text-red-700">Delete Account</h3>
                    <p className="text-sm text-red-500">Permanently delete your account and all data</p>
                  </div>
                </div>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      // Handle account deletion
                    }
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 