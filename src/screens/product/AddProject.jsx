import React, { useState } from "react";
import { Caption, PrimaryButton, Title } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  title: "",
  description: "",
  price: "",
  height: "",
  lengthpic: "",
  width: "",
  mediumused: "",
  weigth: "",
  category: "Arts",
  image_url: "",
};

export const AddProduct = () => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        base_price: parseFloat(formData.price),
        category: formData.category,
        image_url: formData.image_url,
      };
      await api.post("/products", payload);
      toast.success("Product created successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Failed to create product");
    }
  };

  return (
    <>
      <section className="bg-white shadow-s1 p-8 rounded-xl">
        <Title level={5} className=" font-normal mb-5">
          Create Product
        </Title>
        <hr className="my-5" />
        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <Caption className="mb-2">Title *</Caption>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className={`${commonClassNameOfInput}`} placeholder="Title" required />
          </div>
          <div className="py-5">
            <Caption className="mb-2">Category *</Caption>
            <select name="category" value={formData.category} onChange={handleChange} className={`${commonClassNameOfInput}`} required>
              <option value="Arts">Arts</option>
              <option value="Automotive">Automotive</option>
              <option value="Romantic Escapes">Romantic Escapes</option>
              <option value="Watches">Watches</option>
              <option value="Jewelry">Jewelry</option>
            </select>
          </div>
          <div className="flex items-center gap-5 my-4">
            <div className="w-1/2">
              <Caption className="mb-2">Height (cm) </Caption>
              <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="height" className={`${commonClassNameOfInput}`} />
            </div>
            <div className="w-1/2">
              <Caption className="mb-2">Length (cm) </Caption>
              <input type="number" name="lengthpic" value={formData.lengthpic} onChange={handleChange} placeholder="Length" className={`${commonClassNameOfInput}`} />
            </div>
          </div>
          <div className="flex items-center gap-5 my-4">
            <div className="w-1/2">
              <Caption className="mb-2">Width (cm) </Caption>
              <input type="number" name="width" value={formData.width} onChange={handleChange} placeholder="width" className={`${commonClassNameOfInput}`} />
            </div>
            <div className="w-1/2">
              <Caption className="mb-2">
                Medium used <span className=" text-purple-400 italic">(Typically, pencil, ink, charcoal or other)</span>
              </Caption>
              <input type="text" name="mediumused" value={formData.mediumused} onChange={handleChange} placeholder="Medium used" className={commonClassNameOfInput} />
            </div>
          </div>
          <div className="flex items-center gap-5 mt-4">
            <div className="w-1/2">
              <Caption className="mb-2">
                Weight of piece <span className=" text-purple-400 italic">(kg)</span>
              </Caption>
              <input type="number" name="weigth" value={formData.weigth} onChange={handleChange} placeholder="weight" className={`${commonClassNameOfInput}`} />
            </div>
            <div className="w-1/2">
              <Caption className="mb-2">Base Price Range*</Caption>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className={`${commonClassNameOfInput}`} placeholder="Price" required />
            </div>
          </div>
          <div className="my-5">
            <Caption className="mb-2">Image URL *</Caption>
            <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} className={`${commonClassNameOfInput}`} placeholder="https://example.com/image.jpg" required />
          </div>
          <div>
            <Caption className="mb-2">Description *</Caption>
            <textarea name="description" value={formData.description} onChange={handleChange} className={`${commonClassNameOfInput}`} cols="30" rows="5" required></textarea>
          </div>
          <PrimaryButton type="submit" className="rounded-none my-5">
            CREATE
          </PrimaryButton>
        </form>
      </section>
    </>
  );
};
