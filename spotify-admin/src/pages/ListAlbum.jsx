import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { url } from '../App';
import { toast } from 'react-toastify';

const ListAlbum = () => {
  const [data, setData] = useState([]);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', desc: '' });

  // Fetch albums from the backend
  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (response.data.success) {
        setData(response.data.albums);
      }
    } catch (error) {
      toast.error('Error occurred while fetching albums');
    }
  };

  // Remove an album by ID
  const removeAlbum = async (id) => {
    try {
      const response = await axios.post(`${url}/api/album/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAlbums();
      }
    } catch (error) {
      toast.error('Error occurred while removing the album');
    }
  };

  // Handle color change for album
  const handleColorChange = (index, color) => {
    const updatedData = [...data];
    updatedData[index].bgColour = color;
    setData(updatedData);
  };

  // Enable edit mode for an album
  const handleEditClick = (album) => {
    setEditingAlbum(album._id);
    setEditForm({ name: album.name, desc: album.desc, bgColour: album.bgColour });
  };

  // Handle input changes for editing
  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save the edited album
  const saveEdit = async () => {
    try {
      const response = await axios.post(`${url}/api/album/update`, {
        id: editingAlbum,
        name: editForm.name,
        desc: editForm.desc,
        bgColour: editForm.bgColour,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingAlbum(null);
        await fetchAlbums();
      }
    } catch (error) {
      toast.error('Error occurred while updating the album');
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div>
      <p>All Albums List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Album Color</b>
          <b>Action</b>
        </div>
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
            >
              <img className="w-12" src={item.image} alt="" />
              {editingAlbum === item._id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="text-black border border-gray-300 rounded-md px-2"
                  />
                  <input
                    type="text"
                    name="desc"
                    value={editForm.desc}
                    onChange={handleEditChange}
                    className="text-black border border-gray-300 rounded-md px-2"
                  />
                  <input 
                    type="color"
                    name='bgColour'
                    value={editForm.bgColour}
                    onChange={handleEditChange}
                    className='w-10 h-10' />
                </>
              ) : (
                <>
                  <p>{item.name}</p>
                  <p>{item.desc}</p>
                </>
              )}
              <input
                type="color"
                value={item.bgColour}
                onChange={(e) => handleColorChange(index, e.target.value)}
              />
              {editingAlbum === item._id ? (
                <button onClick={saveEdit} className="text-blue-500">
                  Save
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleEditClick(item)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                  <p
                    onClick={() => removeAlbum(item._id)}
                    className="cursor-pointer text-red-500"
                  >
                    x
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListAlbum;
