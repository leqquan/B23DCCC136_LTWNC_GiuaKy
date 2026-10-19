import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useFilterStore, FilterGenre } from '../stores/filterStore';
import { useDebounce } from '../hooks/useDebounce';
import { Genre } from '../types/book.types';

const GENRES: { key: FilterGenre; label: string }[] = [
  { key: 'All', label: 'Tất cả thể loại' },
  { key: 'CNTT', label: 'CNTT' },
  { key: 'Kinh tế', label: 'Kinh tế' },
  { key: 'Ngoại ngữ', label: 'Ngoại ngữ' },
];

export const SearchBar: React.FC = () => {
  const { searchKeyword, selectedGenre, setSearchKeyword, setSelectedGenre, resetFilters } =
    useFilterStore();

  // Local state cho ô input để người dùng gõ mượt mà
  const [localInput, setLocalInput] = useState(searchKeyword);

  // Buổi 2 & Yêu cầu kỹ thuật 5: áp dụng useDebounce 300ms
  const debouncedKeyword = useDebounce<string>(localInput, 300);

  // Khi giá trị debounced thay đổi sau 300ms, đẩy vào Zustand store
  useEffect(() => {
    setSearchKeyword(debouncedKeyword);
  }, [debouncedKeyword, setSearchKeyword]);

  // Đồng bộ lại local input nếu store bị reset từ bên ngoài
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
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Tìm sách theo tên sách hoặc tên tác giả..."
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
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-genre-container">
        <div className="filter-label">
          <Filter size={16} className="icon-mr" />
          <span>Thể loại:</span>
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
              {g.label}
            </button>
          ))}
        </div>

        {(searchKeyword || selectedGenre !== 'All') && (
          <button
            type="button"
            className="reset-filters-btn"
            onClick={resetFilters}
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};
