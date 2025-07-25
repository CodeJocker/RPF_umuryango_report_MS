import React, { useEffect, useState } from "react";
import { api } from "../../utils/Axios";
import { FaUsers, FaUser, FaLayerGroup, FaSyncAlt, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CategoryCard = ({ category, onClick }) => (
  <button
    onClick={() => onClick(category)}
    className="group w-full bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-xl rounded-2xl p-6 flex items-center gap-6 border border-blue-100 dark:border-gray-700 hover:shadow-2xl hover:scale-[1.025] transition-all duration-200"
  >
    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-extrabold uppercase shadow-lg group-hover:scale-110 transition-transform duration-200">
      {category.categoryName?.[0] || "?"}
    </div>
    <div className="flex-1 min-w-0">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate">
        {category.categoryName}
      </h2>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
        <FaLayerGroup className="text-orange-500" />
        <span>
          {category.isGroup ? (
            <span className="inline-flex items-center gap-1">
              <FaUsers className="inline-block" /> Group
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <FaUser className="inline-block" /> Single
            </span>
          )}
        </span>
      </div>
    </div>
    <FaChevronRight className="text-orange-400 text-2xl group-hover:translate-x-1 transition-transform duration-200" />
  </button>
);

const MembersView = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await api.get("/category/v1/get-categories");
        if (res.data && res.data.status === 200) {
          setCategories(res.data.categories);
        } else {
          setFetchError("Failed to load categories.");
        }
      } catch (err) {
        setFetchError("Error loading categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    // Navigate to the members page for the selected category
    navigate(`/members/category/${category._id}`, { state: { category } });
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg mb-2">
            Browse Categories
          </h1>
          <p className="text-blue-200 text-lg font-medium">
            Select a category to view its members.
          </p>
        </header>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSyncAlt className="animate-spin text-blue-500 text-5xl" />
          </div>
        ) : fetchError ? (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-lg border border-red-200 flex items-center gap-2">
            {fetchError}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {categories.length === 0 ? (
              <div className="col-span-full text-center text-blue-200 py-20 text-xl font-semibold">
                No categories found.
              </div>
            ) : (
              categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  onClick={handleCategoryClick}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersView;