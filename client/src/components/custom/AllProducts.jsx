import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Edit, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/slices/productSlice";
import { useToast } from "@/hooks/use-toast";
import useErrorLogout from "@/hooks/use-error-logout";
import { ToastAction } from "../ui/toast";

const AllProducts = () => {
  const { products } = useSelector((state) => state.product);

  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const dispatch = useDispatch();
  const { toast } = useToast();
  const { handleErrorLogout } = useErrorLogout();

  useEffect(() => {
    const getFilterProducts = async () => {
      const res = await axios.get(
        import.meta.env.VITE_API_URL +
          `/get-products?category=${category}&search=${searchTerm}`
      );
      const data = await res.data;
      dispatch(setProducts(data.data));
    };

    getFilterProducts();
  }, [searchTerm, category]);

  const removeFromBlacklist = async (id) => {
    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + `/remove-from-blacklist/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { message } = res.data;

      toast({
        title: "Success",
        description: message,
      });
    } catch (error) {
      handleErrorLogout(error, "Error occured while reverting changes");
    }
  };

  const blacklistProduct = async (id) => {
    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + `/blacklist-product/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { message, data } = res.data;

      toast({
        title: "Success",
        description: message,
        action: (
          <ToastAction
            altText="changes change"
            onClick={() => {
              removeFromBlacklist(data._id);
            }}
          >
            Undo Changes
          </ToastAction>
        ),
      });
    } catch (error) {
      handleErrorLogout(error, "Error occured while blacklisting product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProduct = {
      ...editingProduct,
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      category: formData.get("category"),
    };

    dispatch(
      setProducts(
        products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      )
    );

    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + `/update-product/${editingProduct._id}`,
        {
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          category: updatedProduct.category,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { message } = res.data;

      toast({
        title: message,
      });
    } catch (error) {
      return handleErrorLogout(error, "Error occured while updating product");
    }

    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="mx-auto px-4 sm:px-8 -z-10">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="mb-8">
        <form className="flex gap-4 items-end sm:w-[80vw]">
          <div className="flex-1">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="search"
            >
              Search Products
            </label>
            <div className="relative ">
              <Input
                type="text"
                id="search"
                placeholder="Search by name or description"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div className="w-48">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="category"
            >
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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
        </form>
      </div>

      {products?.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          No products found, Try adjusting your search or category
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-2 sm:mx-o">
          {products?.map((product) => (
            <Card key={product._id} className="flex flex-col">
              <div className="aspect-square relative">
                <img
                  src={product.image.url}
                  alt={product.name}
                  className="rounded-t-lg"
                />
              </div>

              <CardContent className="flex-grow p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {product.description}
                </p>
                <p className="text-lg font-bold">₹{product.price.toFixed(2)}</p>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" onClick={() => handleEdit(product)}>
                  <Edit className="mr-2 h-4 s-4" /> Edit
                </Button>
                <Button
                  onClick={() => {
                    !product.blacklisted
                      ? blacklistProduct(product._id)
                      : removeFromBlacklist(product._id);
                  }}
                >
                  {!product.blacklisted
                    ? "Blacklist Product"
                    : "Remove from Blacklist"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 items-center">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingProduct?.name}
                />
              </div>
              <div className="grid gap-4 items-center">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProduct?.description}
                />
              </div>
              <div className="grid gap-4 items-center">
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={editingProduct?.price}
                />
              </div>
              <div className="grid gap-4 items-center">
                <Label htmlFor="category">category</Label>
                <Select name="category" defaultValue={editingProduct?.category}>
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
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllProducts;
