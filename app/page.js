"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "lucide-react";

const starColors = [
  "text-red-400",
  "text-orange-400",
  "text-yellow-400",
  "text-green-400",
  "text-blue-400",
];

export default function Home() {
  const [formData, setFormData] = useState({
    restaurantName: "",
    location: "",
    latitude: "",
    longitude: "",
    rating: 0,
    tags: "",
    review: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to an API
    console.log("Submitted:", formData);

    // Simulate adding to the list
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      router.push("/map");
    } else {
      console.error("Failed to submit review");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Add Food Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input
                  id="restaurantName"
                  name="restaurantName"
                  required
                  value={formData.restaurantName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  required
                  value={formData.latitude}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  required
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${formData.rating >= star
                      ? `${starColors[star - 1]} fill-current`
                      : "text-gray-300"
                      }`}
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                name="review"
                rows={4}
                value={formData.review}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
