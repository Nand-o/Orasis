/**
 * AdminUsersPage
 *
 * Halaman manajemen pengguna untuk admin. Menyediakan daftar pengguna,
 * pencarian, pembuatan/edit pengguna, serta aksi manajemen (role,
 * penghapusan) menggunakan `adminService`.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Search,
    Plus,
    Edit2,
    Trash2,
    Mail,
    Calendar,
    Shield,
    User,
    X,
    Check,
    MoreVertical,
    Filter,
    ChevronLeft
} from 'lucide-react';
import adminService from '../../services/admin.service';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import UserAvatar from '../../components/ui/UserAvatar';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isRoleOpen, setIsRoleOpen] = useState(false);

    useEffect(() => {
        document.title = 'User Management | Admin | Orasis';
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchQuery, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllUsers();
            setUsers(response.data || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            showMessage('error', 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        if (!searchQuery.trim()) {
            setFilteredUsers(users);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleCreateUser = () => {
        setModalMode('create');
        setSelectedUser(null);
        setFormData({ name: '', email: '', password: '', role: 'user' });
        setShowModal(true);
    };

    const handleEditUser = (user) => {
        setModalMode('edit');
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role
        });
        setShowModal(true);
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await adminService.deleteUser(userId);
            showMessage('success', 'User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            showMessage('error', 'Failed to delete user');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (modalMode === 'create') {
                await adminService.createUser(formData);
                showMessage('success', 'User created successfully');
            } else {
                const updateData = { ...formData };
                if (!updateData.password) {
                    delete updateData.password; // Don't send empty password
                }
                await adminService.updateUser(selectedUser.id, updateData);
                showMessage('success', 'User updated successfully');
            }

            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to save user:', error);
            showMessage('error', error.response?.data?.message || 'Failed to save user');
        }
    };

    const getRoleBadge = (role) => {
        if (role === 'admin') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-violet-100 dark:bg-yellow-900/30 text-violet-700 dark:text-yellow-300 border border-violet-200 dark:border-yellow-800/50">
                    <Shield className="w-3 h-3" />
                    Admin
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                <User className="w-3 h-3" />
                User
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage all users and their roles
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full lg:w-64 pl-10 pr-4 py-2 text-gray-400 dark:text-white bg-white dark:bg-dark-gray border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-yellow-300"
                        />
                    </div>
                    <motion.button
                        onClick={handleCreateUser}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-violet-300/90 hover:bg-violet-300 dark:bg-yellow-300/90 hover:dark:bg-yellow-300 dark:text-main-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-violet-500/20 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add User</span>
                    </motion.button>
                </div>
            </div>

            {/* Users Table / Mobile Cards */}
            <div className="bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">

                {/* Mobile Card View (Visible on Mobile) */}
                <div className="md:hidden">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="p-4 border-b border-gray-100 dark:border-white/5 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-100 dark:bg-white/5 rounded w-1/2 animate-pulse" />
                                        <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-1/3 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredUsers.length === 0 ? (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center gap-3">
                                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                <p>{searchQuery ? 'No users found' : 'No users yet'}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="p-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <UserAvatar 
                                            user={user} 
                                            size="lg"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-gray-900 dark:text-white truncate pr-2">
                                                    {user.name}
                                                </p>
                                                {getRoleBadge(user.role)}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                <Mail className="w-3 h-3" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Actions - Always Visible */}
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="flex-1 py-2 px-3 bg-gray-50 dark:bg-white/5 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-yellow-300 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="flex-1 py-2 px-3 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Table View (Hidden on Mobile) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index}>
                                        <td colSpan="5" className="px-6 py-4">
                                            <div className="h-8 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                            <p>{searchQuery ? 'No users found' : 'No users yet'}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar 
                                                    user={user} 
                                                    size="md"
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-yellow-300 transition-colors">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                        ID: {user.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Mail className="w-4 h-4" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="p-2 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-yellow-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Edit user"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete user"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Create/Edit User */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-dark-gray rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-white/10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {modalMode === 'create' ? 'Create New User' : 'Edit User'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-yellow-300 transition-all"
                                        placeholder="Enter user's name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-yellow-300 transition-all"
                                        placeholder="Enter user's email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Password {modalMode === 'edit' && <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={modalMode === 'create'}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-yellow-300 transition-all"
                                        placeholder={modalMode === 'create' ? 'Enter password' : 'Leave blank to keep current'}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Role
                                    </label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsRoleOpen(!isRoleOpen)}
                                            className={`w-full px-4 py-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                                                isRoleOpen 
                                                    ? 'ring-2 ring-violet-500 dark:ring-yellow-300 border-transparent' 
                                                    : 'border-gray-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-yellow-300/50'
                                            } bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:outline-none`}
                                        >
                                            <span className="font-medium capitalize">
                                                {formData.role}
                                            </span>
                                            <ChevronLeft className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isRoleOpen ? 'rotate-90' : '-rotate-90'}`} />
                                        </button>

                                        {isRoleOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsRoleOpen(false)} />
                                                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-dark-gray border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
                                                    {['user', 'admin'].map(role => (
                                                        <div
                                                            key={role}
                                                            onClick={() => {
                                                                setFormData({ ...formData, role });
                                                                setIsRoleOpen(false);
                                                            }}
                                                            className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between capitalize
                                                                ${formData.role === role
                                                                    ? 'bg-violet-50 dark:bg-yellow-300/10 text-violet-700 dark:text-yellow-300'
                                                                    : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                                                }
                                                            `}
                                                        >
                                                            {role}
                                                            {formData.role === role && <Check className="w-4 h-4" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-violet-600 hover:bg-violet-700 dark:bg-yellow-300/90 dark:hover:bg-yellow-300 text-white dark:text-main-black rounded-xl font-bold transition-colors shadow-lg shadow-violet-500/20"
                                    >
                                        {modalMode === 'create' ? 'Create User' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Message Toast */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 ${message.type === 'success'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                            }`}
                    >
                        {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        <span className="font-medium">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsersPage;
