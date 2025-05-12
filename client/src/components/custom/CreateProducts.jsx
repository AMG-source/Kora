import React, { useRef, useState } from "react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import useErrorLogout from "@/hooks/use-error-logout";
import axios from "axios";

const CreateProducts = () => {
  const [currentColor, setCurrentColor] = useState("#000000");
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const { handleErrorLogout } = useErrorLogout();

  const addColor = () => {
    if (!colors.includes(currentColor)) {
      setColors([...colors, currentColor]);
    }
  };

  const removeColor = (colorToRemove) => {
    setColors(colors.filter((color) => color !== colorToRemove));
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    console.log(files)
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        preview: URL.createObjectURL(file),
        file,
      }));
      setImages((prevImages) => [...prevImages, ...newImages].slice(0, 4));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const description = e.target.description.value;
    const price = e.target.price.value;
    const stock = e.target.stock.value;
    const category = e.target.category.value;

    if (
      !name ||
      !description ||
      !price ||
      !stock ||
      !category ||
      colors.length === 0 ||
      images.length === 0
    ) {
      return toast({
        title: "Error",
        description: "Please fill out all fields",
      });
    }

    if (
      name.trim() === "" ||
      description.trim() === "" ||
      price <= 0 ||
      stock <= 0 ||
      category.trim() === ""
    ) {
      return toast({
        title: "Error",
        description: "Fields cannot be empty",
      });
    }

    if (images.length < 4) {
      return toast({
        title: "Error",
        description: "Please upload at least 4 images",
      });
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    colors.forEach((color) => formData.append("colors", color));
    images.forEach((image) => formData.append("images", image.file));

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/create-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast({
        title: "Success",
        description: res.data.message,
      });
    } catch (error) {
      return handleErrorLogout(error, "Error uploading product");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center absolute inset-0">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl -z-10">
      <CardHeader>
        <CardTitle className="text-2xl">Add New Product</CardTitle>
        <CardDescription>
          Enter the details for the new product you want to add to your
          e-commerce store
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col lg:flex-row lg:w-[70vw]">
          <CardContent className="w-full">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                rows={4}
                id="description"
                name="description"
                placeholder="Enter proudct description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                placeholder="20"
                min="0"
                required
              />
            </div>
          </CardContent>
          <CardContent className="w-full">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Miniatures">Miniatures & Figurines</SelectItem>
                  <SelectItem value="Personalized Gifts">Personalized Gifts</SelectItem>
                  <SelectItem value="Holiday Themes (Xmas, Halloween)">Holiday Themes (Xmas, Halloween)</SelectItem>
                  <SelectItem value="F1">F1</SelectItem>
                  <SelectItem value="Anime">Anime</SelectItem>
                  <SelectItem value="Sculptures">Sculptures</SelectItem>
                  <SelectItem value="Wearables">Wearables</SelectItem>
                  <SelectItem value="HomeDecor">Home Decor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Colors</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="color"
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="w-12 h-12 p-1 rounded-md"
                />
                <Button type="button" variant="outline" onClick={addColor}>
                  Add Color
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 rounded-full pl-2 pr-1 py-1"
                  >
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: color }}
                    ></div>

                    <span className="text-sm mr-1 dark:text-slate-900">
                      {color}
                    </span>
                    <Button
                      variant="ghost"
                      className="h-6 w-6 p-0 rounded-full"
                      onClick={() => removeColor(color)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove Color</span>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Product Images</Label>
                <div className="flex flex-wrap gap-4">
                  {images.map((image, index) => (
                    <div className="relative" key={index}>
                      <img
                        src={image?.preview}
                        alt={`Product image ${index + 1}`}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => removeImage(0)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </div>
                  ))}

                  {images.length < 4 && (
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-[100px] h-[100px]"
                      variant="outline"
                    >
                      <Upload className="h-6 w-6" />
                      <span className="sr-only">Upload Image</span>
                    </Button>
                  )}
                </div>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accpet="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Upload up to 4 images. Supported Formats: JPG,PNG,GIF
                </p>
              </div>
            </div>
          </CardContent>
        </div>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animated-spin" />}
            {isLoading ? "Adding Product..." : "Add Product"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};

export default CreateProducts;
