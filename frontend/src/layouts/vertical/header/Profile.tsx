'use client';

import { Icon } from '@iconify/react';
import * as profileData from './data';
import SimpleBar from 'simplebar-react';
import { Link } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const Profile = () => {
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
            U
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-screen sm:w-[200px] pb-6 pt-4 rounded-sm"
        >
          <SimpleBar>
            {profileData.profileDD.map((items, index) => (
              <DropdownMenuItem
                key={index}
                asChild
                className="px-4 py-2 flex justify-between items-center bg-hover group/link w-full cursor-pointer"
              >
                <Link to={items.url}>
                  <div className="w-full">
                    <div className="ps-0 flex items-center gap-3 w-full">
                      <Icon
                        icon={items.icon}
                        className="text-lg text-muted-foreground group-hover/link:text-primary"
                      />
                      <div className="w-3/4">
                        <h5 className="mb-0 text-sm text-muted-foreground group-hover/link:text-primary">
                          {items.title}
                        </h5>
                      </div>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </SimpleBar>

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
