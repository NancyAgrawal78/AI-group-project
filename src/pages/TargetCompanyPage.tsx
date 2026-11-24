import React, { useMemo, useRef, useState } from 'react';
import { ArrowRight, Building2, Check, Search, Upload } from 'lucide-react';
import { COMPANY_PRESETS } from '../data/presets';
import type { CompanyPreset, PageRoute, TargetSelection } from '../types';

interface TargetCompanyPageProps {
  target: TargetSelection;
  onChangeTarget: (updated: TargetSelection) => void;
  onNavigate: (route: PageRoute) => void;
  onLogActivity: (title: string, detail: string, route: PageRoute) => void;
}

export const TargetCompanyPage: React.FC<TargetCompanyPageProps> = ({
  target,
  onChangeTarget,
  onNavigate,
  onLogActivity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [customCompanyName, setCustomCompanyName] = useState('');
  const jdFileRef = useRef<HTMLInputElement>(null);

  const filteredCompanies = useMemo(() => {
    return COMPANY_PRESETS.filter((company) => {
      const matchesSearch =
        !searchQuery.trim() ||
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.roles.some((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter =
        industryFilter === 'all' ||
        (industryFilter === 'bigtech' &&
          ['google', 'microsoft', 'amazon', 'meta'].includes(company.id)) ||
        (industryFilter === 'consulting' &&
          ['infosys', 'tcs', 'wipro', 'accenture'].includes(company.id)) ||
        (industryFilter === 'product' && ['flipkart', 'stripe'].includes(company.id));

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, industryFilter]);

  const activePreset = COMPANY_PRESETS.find((c) => c.id === target.companyId);

  const selectCompanyPreset = (company: CompanyPreset) => {
    const firstRole = company.roles[0];
    onChangeTarget({
      companyId: company.id,
      companyName: company.name,
      industry: company.industry,
      roleTitle: firstRole.title,
      experienceLevel: firstRole.level,
      jobDescription: firstRole.description,
    });
    onLogActivity('Target company selected', `${company.name} · ${firstRole.title}`, 'target');
  };

  const applyCustomCompany = () => {
    if (!customCompanyName.trim()) return;
    onChangeTarget({
      ...target,
      companyId: 'custom',
      companyName: customCompanyName.trim(),
      industry: 'Custom Target Employer',
    });
    onLogActivity('Custom target company set', customCompanyName.trim(), 'target');
    setCustomCompanyName('');
  };

  const handleJdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChangeTarget({
          ...target,
          jobDescription: reader.result.slice(0, 8000),
        });
        onLogActivity('Job description uploaded', file.name, 'target');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">
            Target Company & Job Role
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Search your dream company, pick a role or customize it, and provide the job description.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('coach')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 rounded-lg hover:opacity-95 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Analyze Skill Match <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Searchable Company Directory */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Google, Microsoft, Amazon, Infosys, TCS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'bigtech', label: 'Big Tech' },
                { id: 'consulting', label: 'IT & Consulting' },
                { id: 'product', label: 'Product' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setIndustryFilter(f.id)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
                    industryFilter === f.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredCompanies.map((company) => {
              const selected = target.companyId === company.id;
              return (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => selectCompanyPreset(company)}
                  className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    selected
                      ? 'border-indigo-600 bg-indigo-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-display font-bold text-slate-900 truncate">
                        {company.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {company.industry}
                      </div>
                    </div>
                    {selected && <Check className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />}
                  </div>
                  <div className="mt-3 text-xs text-slate-600 line-clamp-2">
                    Focus: {company.hiringFocus}
                  </div>
                  <div className="mt-2.5 text-xs text-slate-400">
                    {company.headquarters} · {company.roles.length} preset role
                    {company.roles.length > 1 ? 's' : ''}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Company Input */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Applying somewhere else? Enter any custom company
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., Atlassian, Zomato, NVIDIA..."
                value={customCompanyName}
                onChange={(e) => setCustomCompanyName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyCustomCompany();
                  }
                }}
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={applyCustomCompany}
                className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer whitespace-nowrap"
              >
                Use Custom Company
              </button>
            </div>
          </div>
        </div>

        {/* Right: Role Selection & Job Description */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-slate-500">Selected Target Employer</div>
              <div className="font-display font-bold text-lg text-slate-900 truncate">
                {target.companyName}
              </div>
            </div>
          </div>

          {/* Role Preset Buttons if available */}
          {activePreset && activePreset.roles.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Preset Roles at {activePreset.name}
              </label>
              <div className="space-y-2">
                {activePreset.roles.map((r) => {
                  const isCurrent = target.roleTitle === r.title;
                  return (
                    <button
                      key={r.title}
                      type="button"
                      onClick={() =>
                        onChangeTarget({
                          ...target,
                          roleTitle: r.title,
                          experienceLevel: r.level,
                          jobDescription: r.description,
                        })
                      }
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{r.title}</span>
                        <span className="text-xs text-slate-500 font-normal shrink-0">{r.level}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Editable Role Title */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Target Job Role / Position
            </label>
            <input
              type="text"
              value={target.roleTitle}
              onChange={(e) => onChangeTarget({ ...target, roleTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Job Description Editor + Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-700">Job Description</label>
              <div>
                <input
                  ref={jdFileRef}
                  type="file"
                  accept=".txt,.md,.csv"
                  onChange={handleJdUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => jdFileRef.current?.click()}
                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 hover:text-indigo-900 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload JD (.txt / .md)
                </button>
              </div>
            </div>
            <textarea
              rows={7}
              value={target.jobDescription}
              onChange={(e) => onChangeTarget({ ...target, jobDescription: e.target.value })}
              placeholder="Paste the full job description or requirements here..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          <button
            type="button"
            onClick={() => onNavigate('coach')}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 rounded-lg hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            Continue to AI Career Coach <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
