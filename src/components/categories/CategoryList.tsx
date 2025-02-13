
import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit } from "lucide-react";
import axios from 'axios';
import config from '@/config';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Category {
  id: string;
  name: string;
  slug: string;
//   itemCount: number;
//   totalValue: number;
}

const defaultCategory = {
  id: '',
  name: '',
  slug: '',
//   itemCount: 0,
//   totalValue: 0
};

export const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editForm, setEditForm] = useState<Category>(defaultCategory);
  const [newCategory, setNewCategory] = useState<Category>(defaultCategory);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(`${config.apiURL}/categories/`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (category: Category) => {
    setEditForm(category);
    setIsEditOpen(true);
  };

  const handleViewClick = (category: Category) => {
    setSelectedCategory(category);
    setIsViewOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    form: 'edit' | 'new'
  ) => {
    const { name, value } = e.target;
    if (form === 'edit') {
      setEditForm(prev => ({ ...prev, [name]: value }));
    } else {
      setNewCategory(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateCategory = async () => {
    try {
      await axios.put(`${config.apiURL}/categories/${editForm.id}/`, editForm);
      await fetchCategories();
      setIsEditOpen(false);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleCreateCategory = async () => {
    try {
      await axios.post(`${config.apiURL}/categories/`, newCategory);
      await fetchCategories();
      setIsCreateOpen(false);
      setNewCategory(defaultCategory);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

return (
    <div className="bg-white rounded-lg shadow">
        <div className="p-4">
            <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
            </Button>
        </div>

        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>
                        <div className="flex space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewClick(category)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(category)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        {/* View Category Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCategory?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Slug</Label>
                <p className="mt-1 text-gray-600">{selectedCategory?.slug}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editForm.name}
                  onChange={(e) => handleInputChange(e, 'edit')}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Slug</Label>
                <Input
                  id="edit-slug"
                  name="slug"
                  value={editForm.slug}
                  onChange={(e) => handleInputChange(e, 'edit')}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateCategory}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Category Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-name">Name</Label>
                <Input
                  id="new-name"
                  name="name"
                  value={newCategory.name}
                  onChange={(e) => handleInputChange(e, 'new')}
                />
              </div>
              <div>
                <Label htmlFor="new-description">Slug</Label>
                <Input
                  id="new-slug"
                  name="slug"
                  value={newCategory.slug}
                  onChange={(e) => handleInputChange(e, 'new')}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setNewCategory(defaultCategory);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory}>
                  Create Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
};
