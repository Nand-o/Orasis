import React, { useState, useEffect } from 'react';
import showcaseService from '../../services/showcase.service';

const ShowcaseTestPage = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showcases, setShowcases] = useState([]);

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

    // Test 4: UPDATE Showcase
    const testUpdate = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const updateData = {
                title: 'Updated Title - ' + new Date().toLocaleString(),
                description: 'Updated description at ' + new Date().toLocaleString(),
                url_website: 'https://updated-example.com',
                image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
                category: 'Dashboard',
                tags: []
            };
            const data = await showcaseService.update(id, updateData);
            setResult({
                operation: `UPDATE (${id})`,
                success: true,
                data: data
            });
            fetchShowcases(); // Refresh list
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
        try {
            const data = await showcaseService.delete(id);
            setResult({
                operation: `DELETE (${id})`,
                success: true,
                data: data
            });
            fetchShowcases(); // Refresh list
        } catch (err) {
            setError(err.message || `Failed to delete showcase ${id}`);
            setResult({ operation: `DELETE (${id})`, success: false, error: err });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">🧪 Showcase CRUD Test Page</h1>
            
            {/* Test Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Test Operations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Create Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Create New Showcase</h2>
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
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {showcases.map((showcase) => (
                                <tr key={showcase.id}>
                                    <td className="px-4 py-3 text-sm">{showcase.id}</td>
                                    <td className="px-4 py-3 text-sm">{showcase.title}</td>
                                    <td className="px-4 py-3 text-sm">{showcase.category}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            showcase.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {showcase.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm space-x-2">
                                        <button
                                            onClick={() => testGetById(showcase.id)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => testUpdate(showcase.id)}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => testDelete(showcase.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShowcaseTestPage;
