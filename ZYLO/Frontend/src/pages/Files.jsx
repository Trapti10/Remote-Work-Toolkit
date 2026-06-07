import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiUploadCloud, FiSearch, FiDownload, FiTrash2, FiLink,
  FiX, FiFolder, FiFile, FiImage, FiFileText, FiMusic,
  FiVideo, FiGrid, FiList, FiFilter, FiEye,
} from 'react-icons/fi';
import { BsFiletypePdf, BsFiletypeXlsx, BsFiletypeDocx } from 'react-icons/bs';
import { toast } from 'react-toastify';
import api from '../api';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD = 'dnargenj4';
const CLOUDINARY_PRESET = 'lqxfyxdg';

const formatSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

const getMimeCategory = (mimeType = '') => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) return 'spreadsheet';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
  return 'other';
};

// ─── File Icon ────────────────────────────────────────────────────────────────
const FileIcon = ({ type, className = 'w-8 h-8' }) => {
  const icons = {
    pdf:         <BsFiletypePdf className={`${className} text-red-500`} />,
    image:       <FiImage className={`${className} text-emerald-500`} />,
    document:    <BsFiletypeDocx className={`${className} text-blue-500`} />,
    spreadsheet: <BsFiletypeXlsx className={`${className} text-green-600`} />,
    video:       <FiVideo className={`${className} text-orange-500`} />,
    audio:       <FiMusic className={`${className} text-pink-500`} />,
    other:       <FiFile className={`${className} text-slate-400`} />,
  };
  return icons[type] || icons.other;
};

const typeBg = {
  pdf:         'bg-red-50 border-red-100',
  image:       'bg-emerald-50 border-emerald-100',
  document:    'bg-blue-50 border-blue-100',
  spreadsheet: 'bg-green-50 border-green-100',
  video:       'bg-orange-50 border-orange-100',
  audio:       'bg-pink-50 border-pink-100',
  other:       'bg-slate-50 border-slate-100',
};

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
const FILTERS = [
  { label: 'All Files', value: 'all' },
  { label: 'PDF',       value: 'pdf' },
  { label: 'Images',    value: 'image' },
  { label: 'Documents', value: 'document' },
  { label: 'Sheets',    value: 'spreadsheet' },
  { label: 'Video',     value: 'video' },
  { label: 'Audio',     value: 'audio' },
];

// ─── Upload Modal ─────────────────────────────────────────────────────────────
const UploadModal = ({ onClose, onUploaded }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleSubmit = async () => {
    if (!file) return toast.error('Please select a file');
    setUploading(true);
    setProgress(10);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD);

      setProgress(30);
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`,
        { method: 'POST', body: formData }
      );
      if (!uploadRes.ok) throw new Error('Cloudinary upload failed');
      const data = await uploadRes.json();
      setProgress(75);

      await api.post('/files/upload', {
        fileUrl: data.secure_url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        projectName,
        description,
        cloudinaryPublicId: data.public_id,
      });

      setProgress(100);
      toast.success('File uploaded successfully!');
      onUploaded();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Upload New File</h2>
            <p className="text-xs text-slate-400">Supports any file type up to 100MB</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !file && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer mb-4
            ${dragging ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-400 hover:bg-purple-50/50'}
            ${file ? 'border-purple-400 bg-purple-50' : ''}`}
        >
          {file ? (
            <div className="flex items-center gap-3 justify-center">
              <FileIcon type={getMimeCategory(file.type)} className="w-8 h-8" />
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700 truncate max-w-52">{file.name}</p>
                <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="ml-auto p-1 rounded-lg hover:bg-white text-slate-400"
              >
                <FiX size={14} />
              </button>
            </div>
          ) : (
            <>
              <FiUploadCloud className="mx-auto mb-2 text-purple-400" size={32} />
              <p className="text-sm font-medium text-slate-600">Drag & drop a file here</p>
              <p className="text-xs text-slate-400 mt-1">or <span className="text-purple-600 font-semibold">browse files</span></p>
            </>
          )}
        </div>
        <input ref={inputRef} type="file" className="hidden" onChange={(e) => e.target.files[0] && setFile(e.target.files[0])} />

        {/* Fields */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Project Name <span className="text-slate-300">(optional)</span></label>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. ZYLO Dashboard"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Description <span className="text-slate-300">(optional)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this file about?"
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition resize-none"
            />
          </div>
        </div>

        {/* Progress */}
        {uploading && (
          <div className="mb-4">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1 text-center">Uploading... {progress}%</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={uploading || !file}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <FiUploadCloud size={16} />
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </div>
  );
};

// ─── File Card (Grid) ─────────────────────────────────────────────────────────
const FileCard = ({ file, currentUserId, onDelete }) => {
  const type = file.fileType || getMimeCategory(file.mimeType);
  const isOwner = file.uploadedBy?._id === currentUserId || file.uploadedBy === currentUserId;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(file.fileUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleView = () => window.open(file.fileUrl, '_blank');
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = file.fileUrl;
    a.download = file.originalName || file.fileName;
    a.target = '_blank';
    a.click();
  };

  return (
    <div className={`group border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition-all duration-200 bg-white ${typeBg[type] || typeBg.other}`}>
      {/* Icon + actions */}
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border ${typeBg[type]}`}>
          <FileIcon type={type} className="w-6 h-6" />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleView} title="View" className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-500 shadow-sm">
            <FiEye size={13} />
          </button>
          <button onClick={handleDownload} title="Download" className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-500 shadow-sm">
            <FiDownload size={13} />
          </button>
          <button onClick={handleCopyLink} title="Copy link" className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-500 shadow-sm">
            <FiLink size={13} />
          </button>
          {isOwner && (
            <button onClick={() => onDelete(file._id)} title="Delete" className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-400 shadow-sm">
              <FiTrash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-sm font-semibold text-slate-800 truncate" title={file.originalName}>{file.originalName || file.fileName}</p>
        {file.projectName && (
          <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
            {file.projectName}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="mt-auto pt-2 border-t border-white/60 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-slate-500 font-medium">
            {file.uploadedBy?.fullname?.firstname} {file.uploadedBy?.fullname?.lastname}
          </p>
          <p className="text-[10px] text-slate-400">{formatDate(file.createdAt)}</p>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">{formatSize(file.fileSize)}</span>
      </div>
    </div>
  );
};

// ─── File Row (List) ──────────────────────────────────────────────────────────
const FileRow = ({ file, currentUserId, onDelete }) => {
  const type = file.fileType || getMimeCategory(file.mimeType);
  const isOwner = file.uploadedBy?._id === currentUserId || file.uploadedBy === currentUserId;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(file.fileUrl);
    toast.success('Link copied!');
  };

  return (
    <tr className="group hover:bg-purple-50/50 transition-colors border-b border-slate-100 last:border-0">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${typeBg[type]}`}>
            <FileIcon type={type} className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 truncate max-w-48" title={file.originalName}>
              {file.originalName || file.fileName}
            </p>
            {file.projectName && (
              <span className="text-[10px] font-semibold text-purple-500">{file.projectName}</span>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-slate-500 hidden md:table-cell">
        {file.uploadedBy?.fullname?.firstname} {file.uploadedBy?.fullname?.lastname}
      </td>
      <td className="py-3 px-4 text-sm text-slate-400 hidden lg:table-cell">{formatSize(file.fileSize)}</td>
      <td className="py-3 px-4 text-sm text-slate-400 hidden lg:table-cell">{formatDate(file.createdAt)}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => window.open(file.fileUrl, '_blank')} className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-slate-600 transition-colors" title="View">
            <FiEye size={14} />
          </button>
          <button onClick={() => { const a = document.createElement('a'); a.href = file.fileUrl; a.download = file.originalName; a.target='_blank'; a.click(); }} className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-slate-600 transition-colors" title="Download">
            <FiDownload size={14} />
          </button>
          <button onClick={handleCopyLink} className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-purple-500 transition-colors" title="Copy link">
            <FiLink size={14} />
          </button>
          {isOwner && (
            <button onClick={() => onDelete(file._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <FiTrash2 className="text-red-500" size={20} />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">Delete File?</h3>
      <p className="text-sm text-slate-400 mb-6">This action cannot be undone. The file will be permanently removed.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-colors">
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ filter, onUpload }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-3xl bg-purple-100 flex items-center justify-center mb-4">
      <FiFolder className="text-purple-400" size={36} />
    </div>
    <h3 className="text-lg font-bold text-slate-700 mb-1">
      {filter === 'all' ? 'No files yet' : `No ${filter} files found`}
    </h3>
    <p className="text-sm text-slate-400 mb-5 max-w-xs">
      {filter === 'all'
        ? 'Upload your first file to get started.'
        : 'Try a different filter or upload a new file.'}
    </p>
    <button
      onClick={onUpload}
      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
    >
      <FiUploadCloud size={16} /> Upload File
    </button>
  </div>
);

// ─── Main Files Page ──────────────────────────────────────────────────────────
const Files = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showUpload, setShowUpload] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const currentUserId = (() => {
    try { return JSON.parse(localStorage.getItem('user'))?._id; } catch { return ''; }
  })();

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeFilter !== 'all') params.type = activeFilter;
      if (search.trim()) params.search = search.trim();
      const res = await api.get('/files', { params });
      setFiles(res.data);
    } catch {
      toast.error('Error fetching files');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search]);

  useEffect(() => {
    const t = setTimeout(fetchFiles, 300);
    return () => clearTimeout(t);
  }, [fetchFiles]);

  const handleDelete = async () => {
    try {
      await api.delete(`/files/${deleteId}`);
      toast.success('File deleted');
      setDeleteId(null);
      fetchFiles();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-full p-4 md:p-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Team Files</h1>
          <p className="text-sm text-slate-400 mt-0.5">Store, organize, and share files securely.</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-purple-200 transition-colors self-start sm:self-auto"
        >
          <FiUploadCloud size={16} />
          Upload File
        </button>
      </div>

      {/* ── Search + View Toggle ── */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or project..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white transition"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <FiX size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FiGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FiList size={16} />
          </button>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border
              ${activeFilter === f.value
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:border-purple-300 hover:text-purple-600'
              }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 self-center">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-2'
        }>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <EmptyState filter={activeFilter} onUpload={() => setShowUpload(true)} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((f) => (
            <FileCard key={f._id} file={f} currentUserId={currentUserId} onDelete={setDeleteId} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">File</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">Uploaded By</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">Size</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <FileRow key={f._id} file={f} currentUserId={currentUserId} onDelete={setDeleteId} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modals ── */}
      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onUploaded={fetchFiles} />
      )}
      {deleteId && (
        <DeleteModal onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
};

export default Files;