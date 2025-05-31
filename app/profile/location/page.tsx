'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, MapPin, Search } from 'lucide-react'
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
}

// Default center to Nairobi, Kenya
const defaultCenter = {
  lat: -1.2921,
  lng: 36.8219,
}

export default function UpdateLocationPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const [addressDetails, setAddressDetails] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  // Fetch current location on load
  useEffect(() => {
    fetchCurrentLocation()
  }, [])

  const fetchCurrentLocation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      const { data: location, error } = await supabase
        .from('locations')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      if (location) {
        setSelectedLocation({
          lat: location.latitude,
          lng: location.longitude
        })
        setAddressDetails(location.address)
      }
    } catch (error) {
      console.error('Error fetching location:', error)
    }
  }

  // Handle search box load
  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete
  }

  // Handle place selection
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        setSelectedLocation({ lat, lng })
        setAddressDetails(place.formatted_address || '')
      }
    }
  }

  // Handle manual search
  const handleSearch = async () => {
    if (!searchValue.trim()) return

    setIsSearching(true)
    try {
      const geocoder = new google.maps.Geocoder()
      const result = await geocoder.geocode({ address: searchValue })
      
      if (result.results[0]) {
        const location = result.results[0].geometry.location
        const lat = location.lat()
        const lng = location.lng()
        setSelectedLocation({ lat, lng })
        setAddressDetails(result.results[0].formatted_address)
      } else {
        toast.error('Location not found')
      }
    } catch (error) {
      toast.error('Error searching location')
    } finally {
      setIsSearching(false)
    }
  }

  // Handle location selection
  const handleLocationSelect = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setSelectedLocation({ lat, lng })
      await getAddressFromCoordinates(lat, lng)
    }
  }

  // Get address from coordinates
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()
      if (data.results && data.results[0]) {
        setAddressDetails(data.results[0].formatted_address)
      }
    } catch (error) {
      console.error('Error getting address:', error)
    }
  }

  // Handle location update
  const handleUpdateLocation = async () => {
    if (!selectedLocation) {
      toast.error('Please select a location')
      return
    }

    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('locations')
        .upsert({
          user_id: user.id,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          address: addressDetails
        })

      if (error) throw error

      toast.success('Location updated successfully')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update location')
      console.error('Error updating location:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Update Delivery Location</CardTitle>
          <CardDescription>
            Set or update your delivery location by searching or clicking on the map
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Search Location</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search for your location..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
              <Button 
                type="button" 
                onClick={handleSearch}
                disabled={isSearching}
                variant="outline"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Map</Label>
            <LoadScript 
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
              libraries={['places']}
            >
              <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
              >
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={selectedLocation || defaultCenter}
                  zoom={13}
                  onClick={handleLocationSelect}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  {selectedLocation && (
                    <Marker
                      position={selectedLocation}
                      draggable={true}
                      onDragEnd={handleLocationSelect}
                    />
                  )}
                </GoogleMap>
              </Autocomplete>
            </LoadScript>

            {selectedLocation && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{addressDetails || 'Location selected'}</span>
                </div>
              </div>
            )}
          </div>

          <Button 
            className="w-full" 
            onClick={handleUpdateLocation}
            disabled={isLoading || !selectedLocation}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Location'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 