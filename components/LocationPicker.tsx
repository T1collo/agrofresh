'use client'

import { useState, useRef, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Loader2, Search, MapPin } from 'lucide-react'
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api'
import { toast } from 'sonner'

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

interface LocationPickerProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  initialLocation?: { lat: number; lng: number; address: string }
}

export function LocationPicker({ isOpen, onClose, onLocationSelect, initialLocation }: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(
    initialLocation ? { lat: initialLocation.lat, lng: initialLocation.lng } : null
  )
  const [addressDetails, setAddressDetails] = useState(initialLocation?.address || '')
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

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

  // Handle location selection
  const handleLocationSelect = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setSelectedLocation({ lat, lng })
      await getAddressFromCoordinates(lat, lng)
    }
  }

  const handleConfirm = () => {
    if (selectedLocation && addressDetails) {
      onLocationSelect({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: addressDetails
      })
      onClose()
    } else {
      toast.error('Please select a location on the map')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Delivery Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{addressDetails || 'Location selected'}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedLocation}>
              Confirm Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 