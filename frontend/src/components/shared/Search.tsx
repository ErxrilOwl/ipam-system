import React, { useState, type FormEvent } from "react"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";

type SearchProps = {
    onSearch: (query: string) => void,
    placeholder?: string
}

const Search: React.FC<SearchProps> = ({ onSearch, placeholder = "Search..." }) => {
    const [query, setQuery] = useState<string>("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(query);
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center relative gap-1">
            <label htmlFor="search" className="sr-only">Search</label>
            <Input
                type="search"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button 
                type="submit"
                variant={'default'}>
                    <SearchIcon className="w-3 h-3" />
                    <span className="sr-only">Search</span>
            </Button>
        </form>
    )
}

export default Search;