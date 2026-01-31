'use client';

import { Link } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="relative group/menu ps-1 sm:ps-15 shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="
            w-8 h-8
            rounded-full
            flex items-center justify-center
            bg-primary
            text-white
            font-medium
            text-sm
            select-none
            transition-colors
            hover:bg-lightprimary
            hover:text-primary
          ">
            { user ? user?.name[0].toUpperCase() : 'X' }
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-screen sm:w-[200px] pb-6 pt-4 rounded-sm"
        >
          <DropdownMenuItem disabled={true}>
            { user ? user?.name : 'User' }
          </DropdownMenuItem>

          <DropdownMenuSeparator className='my-2' />

          <div className="pt-2 px-4">
            <Button
              asChild
              variant="outline"
              className="w-full rounded-md"
            >
              <Link to="/auth/auth2/login">Logout</Link>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
