import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, Clock, Sparkles, Building2 } from 'lucide-react';
import API from '../services/api';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('All');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (location.trim()) params.location = location.trim();
      if (employmentType && employmentType !== 'All') params.employmentType = employmentType;

      const res = await API.get('/jobs', { params });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [employmentType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClearFilters = () => {
    setKeyword('');
    setLocation('');
    setEmploymentType('All');
    // will trigger re-fetch via useEffect on employmentType or we can call:
    API.get('/jobs').then((res) => setJobs(res.data.jobs || []));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Job Openings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Discover opportunities matching your skills and apply with tailored or profile CVs.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Title, skill (e.g. Next.js, React)..."
            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, country, or Remote..."
            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          >
            <option value="All">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
          >
            Search
          </button>
          {(keyword || location || employmentType !== 'All') && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-800">{jobs.length}</strong> available opening(s)
        </span>
      </div>

      {/* Job Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No matching positions found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, clearing filters, or exploring different keywords.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
          >
            Show All Jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-teal-500 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                    {job.employmentType}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-teal-600 transition">
                    <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.company}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{job.location}</span>
                </p>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {(job.requiredSkills || []).slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 text-[11px] font-medium bg-teal-50 text-teal-800 rounded-md border border-teal-100"
                      >
                        {skill}
                      </span>
                    ))}
                    {(job.requiredSkills || []).length > 4 && (
                      <span className="px-1.5 py-0.5 text-[11px] text-slate-400">
                        +{(job.requiredSkills || []).length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  to={`/jobs/${job._id}`}
                  className="block text-center w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
                >
                  View Details & Apply
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
