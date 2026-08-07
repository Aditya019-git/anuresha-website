"use client";

import { useEffect, useState } from "react";
import { getPortfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "@/app/actions";
import Image from "next/image";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  cover_image: string;
  pre_execution_images: string[];
  post_execution_images: string[];
  client_review: string;
  client_rating: number;
  created_at: string;
};

export default function PortfolioAdmin() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Residential");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const result = await getPortfolioItems();
      if (result.success && result.data) {
        setItems(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(item: PortfolioItem) {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);

    let desc = item.client_review;
    try {
      const parsed = JSON.parse(item.client_review);
      if (parsed && typeof parsed === 'object') desc = parsed.description || parsed.review || "";
    } catch (e) {
      // plain text
    }
    setEditDescription(desc);
  }

  function cancelEdit() {
    setEditingItem(null);
    setEditTitle("");
    setEditCategory("Residential");
    setEditDescription("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAdding(true);
    const formData = new FormData(e.currentTarget);

    if (editingItem) {
      formData.append("id", editingItem.id);
      formData.append("existing_cover", editingItem.cover_image || "");
      formData.append("existing_extra", JSON.stringify(editingItem.post_execution_images || []));

      const result = await updatePortfolioItem(formData);
      if (result.success) {
        cancelEdit();
        // @ts-ignore
        e.target.reset();
        await fetchItems();
        alert("Project updated successfully!");
      } else {
        alert("Failed to update project.");
      }
    } else {
      const result = await addPortfolioItem(formData);
      if (result.success) {
        // @ts-ignore
        e.target.reset();
        await fetchItems();
        alert("Project published successfully!");
      } else {
        alert(result.error || "Failed to add portfolio item.");
      }
    }

    setAdding(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    const result = await deletePortfolioItem(id);
    if (result.success) {
      setItems(items.filter(item => item.id !== id));
      if (editingItem?.id === id) cancelEdit();
      alert("Project deleted.");
    } else {
      alert("Failed to delete item.");
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8 mt-4">
      
      <div className="mb-8">
        <h2 className="font-outfit text-3xl font-bold text-stone-900">Manage Master Portfolio</h2>
        <p className="text-stone-500 mt-1 text-sm">Add, edit, or remove your previous work to showcase on the website.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 sticky top-8">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-outfit text-xl font-bold text-stone-900">
                {editingItem ? "Edit Project" : "Add New Project"}
              </h3>
              {editingItem && (
                <button 
                  onClick={cancelEdit}
                  className="text-xs text-amber-700 hover:text-amber-900 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200"
                >
                  ✕ Cancel Edit
                </button>
              )}
            </div>
            <p className="text-xs text-stone-500 mb-4">
              {editingItem ? "Update title, category, description, or photos." : "Add a cover photo, project name, description, and up to 5 extra photos."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-4">
                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider">Project Details</h4>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Project Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    placeholder="e.g. 4BHK Luxury Apartment" 
                    value={editingItem ? editTitle : undefined}
                    onChange={editingItem ? (e) => setEditTitle(e.target.value) : undefined}
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-amber-500 outline-none text-stone-900 bg-white" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <select 
                    name="category" 
                    required 
                    value={editingItem ? editCategory : undefined}
                    onChange={editingItem ? (e) => setEditCategory(e.target.value) : undefined}
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-amber-500 outline-none text-stone-900 bg-white"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Solar">Solar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Cover Photo {editingItem ? <span className="text-stone-400 font-normal">(Leave blank to keep existing)</span> : <span className="text-red-500">*</span>}
                  </label>
                  <input 
                    type="file" 
                    name="cover_image" 
                    accept="image/*" 
                    required={!editingItem} 
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-amber-500 outline-none text-stone-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">About the Work <span className="text-red-500">*</span></label>
                  <textarea 
                    name="project_description" 
                    rows={3} 
                    required 
                    placeholder="Write something about this project..." 
                    value={editingItem ? editDescription : undefined}
                    onChange={editingItem ? (e) => setEditDescription(e.target.value) : undefined}
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-amber-500 outline-none text-stone-900 bg-white text-sm"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Extra Photos {editingItem ? <span className="text-stone-400 font-normal">(Leave blank to keep existing)</span> : <span className="text-stone-400 font-normal">(up to 5)</span>}
                  </label>
                  <input 
                    type="file" 
                    name="extra_photos" 
                    accept="image/*" 
                    multiple 
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-amber-500 outline-none text-stone-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" 
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit" 
                  disabled={adding}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 shadow-md"
                >
                  {adding ? (editingItem ? "Updating..." : "Publishing...") : (editingItem ? "Update Project" : "Publish Project")}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Existing Items Grid */}
        <div className="xl:col-span-2">
          {loading ? (
            <div className="text-center py-12 text-stone-500">Loading portfolio...</div>
          ) : items.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-stone-200 border-dashed text-center">
              <h3 className="text-stone-900 font-bold mb-2">No Portfolio Items Yet</h3>
              <p className="text-stone-500 text-sm">Add your first project using the form to the left.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map(item => {
                let desc = item.client_review;
                try {
                  const parsed = JSON.parse(item.client_review);
                  if (parsed && typeof parsed === 'object') desc = parsed.description || parsed.review || "";
                } catch (e) {
                  // plain text
                }

                const isEditing = editingItem?.id === item.id;

                return (
                  <div 
                    key={item.id} 
                    className={`bg-white rounded-xl overflow-hidden shadow-sm border transition-all flex flex-col ${isEditing ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-stone-200'}`}
                  >
                    <div className="relative h-48 w-full bg-stone-100 shrink-0 group">
                      <Image src={item.cover_image || '/images/about_bg.png'} alt={item.title} fill unoptimized={true} className="object-cover" />
                      <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                        <button 
                          onClick={() => startEdit(item)}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-lg transition-all"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-lg transition-all"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{item.category}</span>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => startEdit(item)}
                            className="text-stone-500 hover:text-amber-600 text-xs font-semibold px-2 py-0.5 rounded hover:bg-stone-100"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-stone-500 hover:text-red-600 text-xs font-semibold px-2 py-0.5 rounded hover:bg-stone-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <h4 className="font-outfit font-bold text-stone-900 text-xl mb-3">{item.title}</h4>
                      
                      {desc && (
                        <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 mb-3 flex-1">
                          <p className="text-xs text-stone-600 line-clamp-3">{desc}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 text-xs text-stone-500 font-medium">
                        <span className="bg-stone-100 px-2 py-1 rounded">{(item.post_execution_images || []).length} Extra Photos</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
