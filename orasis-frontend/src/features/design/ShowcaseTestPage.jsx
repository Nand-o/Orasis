import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import showcaseService from '../../services/showcase.service';
import { useAuth } from '../../context/AuthContext';

const ShowcaseTestPage = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showcases, setShowcases] = useState([]);
    const [editingId, setEditingId] = useState(null);

    // Form data for CREATE and UPDATE
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url_website: '',
        image_url: '',
        category: 'Landing Page',
        tags: []
    });

    // Fetch all showcases on mount
    useEffect(() => {
        fetchShowcases();
    }, []);

    const fetchShowcases = async () => {
        try {
            const data = await showcaseService.getAll();
            setShowcases(data.data || []);
        } catch (err) {
            console.error('Failed to fetch showcases:', err);
        }
    };

    // Test 1: GET All Showcases
    const testGetAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await showcaseService.getAll();
            setResult({
                operation: 'GET ALL',
                success: true,
                data: data,
                count: data.data?.length || 0
            });
            fetchShowcases();
        } catch (err) {
            setError(err.message || 'Failed to get all showcases');
            setResult({ operation: 'GET ALL', success: false, error: err });
        } finally {
            setLoading(false);
        }
    };

    // Test 2: GET by ID
    const testGetById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await showcaseService.getById(id);
            setResult({
                operation: `GET BY ID (${id})`,
                success: true,
                data: data
            });
        } catch (err) {
            setError(err.message || `Failed to get showcase ${id}`);
            setResult({ operation: `GET BY ID (${id})`, success: false, error: err });
        } finally {
            setLoading(false);
        }
    };

    // Fill Dummy Data
    const fillDummyData = () => {
        const dummyDataSets = [
            {
                title: 'Modern E-Commerce Dashboard',
                description: 'A sleek and modern e-commerce dashboard with real-time analytics, inventory management, and order tracking. Built with React and Tailwind CSS.',
                url_website: 'https://example.com/ecommerce-dashboard',
                image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
                category: 'Dashboard'
            },
            {
                title: 'Minimalist Portfolio Website',
                description: 'A clean and elegant portfolio website showcasing creative work with smooth animations and interactive elements. Perfect for designers and developers.',
                url_website: 'https://example.com/portfolio',
                image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
                category: 'Web Design'
            },
            {
                title: 'Social Media Mobile App UI',
                description: 'Modern social media app interface with intuitive navigation, stories feature, and engaging user interactions. Designed for iOS and Android.',
                url_website: 'https://example.com/social-app',
                image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
                category: 'App Design'
            },
            {
                title: 'Restaurant Landing Page',
                description: 'Appetizing restaurant landing page with menu showcase, online reservation system, and beautiful food photography.',
                url_website: 'https://example.com/restaurant',
                image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
                category: 'Landing Page'
            },
            {
                title: 'Creative Agency Website',
                description: 'Bold and creative agency website featuring case studies, team profiles, and dynamic project showcases.',
                url_website: 'https://example.com/agency',
                image_url: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800',
                category: 'Web Design'
            }
        ];
        
        const randomData = dummyDataSets[Math.floor(Math.random() * dummyDataSets.length)];
        setFormData({
            ...formData,
            ...randomData
        });
    };

    // Test 3: CREATE Showcase
    const testCreate = async () => {
        setLoading(true);
        setError(null);
        try {
            const testData = {
                title: formData.title || 'Test Showcase ' + Date.now(),
                description: formData.description || 'This is a test showcase created via API',
                url_website: formData.url_website || 'https://example.com',
                image_url: formData.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
                category: formData.category,
                tags: []
            };
            const data = await showcaseService.create(testData);
            setResult({
                operation: 'CREATE',
                success: true,
                data: data
            });
            fetchShowcases(); // Refresh list
            // Reset form
            setFormData({
                title: '',
                description: '',
                url_website: '',
                image_url: '',
                category: 'Landing Page',
                tags: []
            });
        } catch (err) {
            setError(err.message || 'Failed to create showcase');
            setResult({ operation: 'CREATE', success: false, error: err });
        } finally {
            setLoading(false);
        }
    };

    // Load showcase data for editing
    const loadForEdit = async (id) => {
        try {
            const data = await showcaseService.getById(id);
            const showcase = data.data;
            setFormData({
                title: showcase.title,
                description: showcase.description,
                url_website: showcase.url_website,
                image_url: showcase.image_url,
                category: showcase.category,
                tags: showcase.tags || []
            });
            setEditingId(id);
            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError('Failed to load showcase data');
        }
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setFormData({
            title: '',
            description: '',
            url_website: '',
            image_url: '',
            category: 'Landing Page',
            tags: []
        });
    };

    // Test 4: UPDATE Showcase
    const testUpdate = async () => {
        if (!editingId) {
            setError('No showcase selected for update');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const updateData = {
                title: formData.title,
                description: formData.description,
                url_website: formData.url_website,
                image_url: formData.image_url,
                category: formData.category,
                tags: []
            };
            const data = await showcaseService.update(editingId, updateData);
            setResult({
                operation: `UPDATE SHOWCASE (${editingId})`,
                success: true,
                data: data
            });
            fetchShowcases(); // Refresh list
            cancelEdit(); // Clear form
        } catch (err) {
            setError(err.message || `Failed to update showcase ${id}`);
            setResult({ operation: `UPDATE (${id})`, success: false, error: err });
        } finally {
            setLoading(false);
        }
    };

    // Test 5: DELETE Showcase
    const testDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete showcase ${id}?`)) {
            return;
        }
        
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            console.log(`Attempting to delete showcase ${id}...`);
            const data = await showcaseService.delete(id);
            console.log('DELETE Response:', data);
            setResult({
                operation: `DELETE SHOWCASE (${id})`,
                success: true,
                data: data
            });
            fetchShowcases(); // Refresh list
        } catch (err) {
            console.error(`DELETE Error (${id}):`, err);
            const errorMessage = err?.message || err?.error || `Failed to delete showcase ${id}`;
            setError(errorMessage);
            setResult({ 
                operation: `DELETE SHOWCASE (${id})`, 
                success: false, 
                error: typeof err === 'string' ? { message: err } : err 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">🧪 Showcase CRUD Test Page</h1>
            
            {/* Authentication Status */}
            <div className={`rounded-lg p-4 mb-6 ${isAuthenticated ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`font-semibold mb-1 ${isAuthenticated ? 'text-green-900 dark:text-green-100' : 'text-yellow-900 dark:text-yellow-100'}`}>
                            {isAuthenticated ? '✅ Authenticated' : '⚠️ Not Authenticated'}
                        </h3>
                        {isAuthenticated ? (
                            <p className="text-sm text-green-800 dark:text-green-200">
                                Logged in as: <strong>{user?.name}</strong> ({user?.email})
                            </p>
                        ) : (
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                CREATE, UPDATE, DELETE operations require authentication
                            </p>
                        )}
                    </div>
                    {isAuthenticated ? (
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium inline-block"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
            
            {/* Test Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Test Operations</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <button
                        onClick={testGetAll}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        📋 GET All
                    </button>
                    <button
                        onClick={() => testGetById(1)}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        🔍 GET by ID (1)
                    </button>
                    <button
                        onClick={testCreate}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        ➕ CREATE
                    </button>
                </div>
            </div>

            {/* Create/Update Form */}
            <div className={`rounded-lg shadow-lg p-6 mb-6 ${editingId ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400' : 'bg-white dark:bg-gray-800'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {editingId ? `✏️ Update Showcase #${editingId}` : '➕ Create New Showcase'}
                        </h2>
                        {editingId && (
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                Editing mode - modify the fields below and click Update
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {editingId && (
                            <button
                                onClick={cancelEdit}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
                            >
                                ✖️ Cancel Edit
                            </button>
                        )}
                        {!editingId && (
                            <button
                                onClick={fillDummyData}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm font-medium"
                            >
                                🎲 Fill Dummy Data
                            </button>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <input
                        type="text"
                        placeholder="Website URL"
                        value={formData.url_website}
                        onChange={(e) => setFormData({...formData, url_website: e.target.value})}
                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option>Landing Page</option>
                        <option>SaaS</option>
                        <option>E-commerce</option>
                        <option>Portfolio</option>
                        <option>Dashboard</option>
                    </select>
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 col-span-2"
                        rows="3"
                    />
                </div>
                <div className="mt-4">
                    <button
                        onClick={editingId ? testUpdate : testCreate}
                        disabled={loading || !formData.title || !formData.url_website}
                        className={`w-full py-3 rounded font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                            editingId 
                                ? 'bg-blue-600 hover:bg-blue-700' 
                                : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                    >
                        {loading ? '⏳ Processing...' : editingId ? '💾 Update Showcase' : '➕ Create Showcase'}
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="bg-linear-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border border-purple-200 dark:border-gray-600 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">
                    📚 How to Use This Form
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">➕</span>
                        <div>
                            <p className="font-semibold text-purple-700 dark:text-purple-300">CREATE Mode (Default)</p>
                            <p className="text-gray-700 dark:text-gray-300">Fill in the form fields and click <span className="font-mono bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">➕ Create Showcase</span> to add a new showcase to the database.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">✏️</span>
                        <div>
                            <p className="font-semibold text-blue-700 dark:text-blue-300">UPDATE Mode</p>
                            <p className="text-gray-700 dark:text-gray-300">Click the <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">Update</span> button on any showcase row below. The form will populate with that showcase's data (blue background). Modify the fields and click <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">💾 Update Showcase</span> to save changes.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🔒</span>
                        <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Authorization</p>
                            <p className="text-gray-700 dark:text-gray-300">You can only UPDATE or DELETE showcases you own. Admins can modify all showcases. Buttons are disabled for showcases you don't have permission to modify.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p className="text-blue-700">⏳ Loading...</p>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">❌ Error: {error}</p>
                </div>
            )}

            {/* Result Display */}
            {result && (
                <div className={`border-l-4 p-4 mb-6 ${result.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                    <h3 className="font-semibold mb-2">
                        {result.success ? '✅' : '❌'} {result.operation}
                    </h3>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto text-sm">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}

            {/* Showcases List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                    📋 All Showcases ({showcases.length})
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Title</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Owner</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {showcases.map((showcase) => {
                                const canModify = user && (user.id === showcase.user_id || user.role === 'admin');
                                return (
                                    <tr key={showcase.id}>
                                        <td className="px-4 py-3 text-sm">{showcase.id}</td>
                                        <td className="px-4 py-3 text-sm">{showcase.title}</td>
                                        <td className="px-4 py-3 text-sm">{showcase.category?.name || 'N/A'}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                showcase.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                                {showcase.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="text-gray-600 dark:text-gray-400 text-xs">
                                                {showcase.user?.name || `User #${showcase.user_id}`}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm space-x-2">
                                            <button
                                                onClick={() => testGetById(showcase.id)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => loadForEdit(showcase.id)}
                                                disabled={!canModify}
                                                className={`${canModify ? 'text-green-600 hover:text-green-800 dark:text-green-400' : 'text-gray-400 cursor-not-allowed'}`}
                                                title={!canModify ? 'Only owner or admin can update' : 'Load data to form for editing'}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => testDelete(showcase.id)}
                                                disabled={!canModify}
                                                className={`${canModify ? 'text-red-600 hover:text-red-800 dark:text-red-400' : 'text-gray-400 cursor-not-allowed'}`}
                                                title={!canModify ? 'Only owner or admin can delete' : ''}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShowcaseTestPage;
