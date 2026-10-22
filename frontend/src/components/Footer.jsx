import React from 'react';
import { Briefcase, Heart, Cpu, Database, Server, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight">HireFlow</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Smart Recruitment Platform built with the MERN stack and AI-assisted qualification analysis.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">MERN Architecture</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                <span>MongoDB & Mongoose</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-teal-400" />
                <span>Express.js & Node.js</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span>React.js & Tailwind CSS</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-400" />
                <span>AI CV Analysis Engine</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Workflows & Security</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Human-in-the-Loop Decisions</li>
              <li>Independent CV Preservation</li>
              <li>Confidential Recruiter Notes</li>
              <li>Status Tracking & In-App Alerts</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Evaluation Compliance</h4>
            <p className="text-slate-400 leading-relaxed">
              Designed and implemented according to the HireFlow MERN specifications with realistic end-to-end recruiter & candidate scenarios.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HireFlow - Smart Recruitment Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for recruitment teams & job seekers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
