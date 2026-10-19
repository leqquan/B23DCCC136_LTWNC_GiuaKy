import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Layers, Code2, TrendingUp, Languages, RotateCcw } from 'lucide-react';
import { useFilterStore, FilterGenre } from '../stores/filterStore';
import { useDebounce } from '../hooks/useDebounce';

interface GenreOption {
  key: FilterGenre;
  label: string;
  icon: React.ReactNode;
}

const GENRES: GenreOption[] = [
  { key: 'All', label: 'Tất cả thể loại', icon: <Layers size={14} className="icon-mr" /> },
  { key: 'CNTT', label: 'CNTT', icon: <Code2 size={14} className="icon-mr" /> },
  { key: 'Kinh tế', label: 'Kinh tế', icon: <TrendingUp size={14} className="icon-mr" /> },
  { key: 'Ngoại ngữ', label: 'Ngoại ngữ', icon: <Languages size={14} className="icon-mr" /> },
];

export const SearchBar: React.FC = () => {
  const { searchKeyword, selectedGenre, setSearchKeyword, setSelectedGenre, resetFilters } =
    useFilterStore();

  const [localInput, setLocalInput] = useState(searchKeyword);
  const debouncedKeyword = useDebounce<string>(localInput, 300);

  useEffect(() => {
    setSearchKeyword(debouncedKeyword);
  }, [debouncedKeyword, setSearchKeyword]);

  useEffect(() => {
    setLocalInput(searchKeyword);
  }, [searchKeyword]);

  const handleClear = () => {
    setLocalInput('');
    setSearchKeyword('');
  };

  return (
    <div className="search-filter-card">
      <div className="search-input-wrapper">
        <div className="search-icon-badge">
          <Search size={18} />
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Tìm sách theo tên giáo trình hoặc tên tác giả (tự động debounce 300ms)..."
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          data-testid="search-input"
        />
        {localInput && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={handleClear}
            aria-label="Xóa từ khóa tìm kiếm"
            title="Xóa tìm kiếm"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-genre-container">
        <div className="filter-label">
          <Filter size={15} className="icon-mr" />
          <span>Lọc thể loại:</span>
        </div>
        <div className="genre-buttons-group">
          {GENRES.map((g) => (
            <button
              key={g.key}
              type="button"
              className={`genre-pill-btn ${selectedGenre === g.key ? 'active' : ''}`}
              onClick={() => setSelectedGenre(g.key)}
              data-testid={`filter-genre-${g.key}`}
            >
              {g.icon}
              {g.label}
            </button>
          ))}
        </div>

        {(searchKeyword || selectedGenre !== 'All') && (
          <button
            type="button"
            className="reset-filters-btn"
            onClick={resetFilters}
            title="Xóa toàn bộ bộ lọc"
          >
            <RotateCcw size={13} className="icon-mr" />
            Đặt lại bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};
