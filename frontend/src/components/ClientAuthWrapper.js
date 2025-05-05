'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getUserRoleFromToken } from '../utils/getUserRoleFromToken';

export default function ClientAuthWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = Cookies.get('user_token');
    const role = getUserRoleFromToken();

    const publicUserRoutes = ['/user/login', '/user/signup'];
    const publicAdminRoutes = ['/user/login'];

    const isUserRoute = pathname.startsWith('/user');
    const isAdminRoute = pathname.startsWith('/admin');

    if (!token || !role) {
      if (isUserRoute && !publicUserRoutes.includes(pathname)) {
        router.push('/user/login');
        return;
      }
      if (isAdminRoute && !publicAdminRoutes.includes(pathname)) {
        router.push('/user/login');
        return;
      }
    }

    if (token && role) {
      if (publicUserRoutes.includes(pathname) || publicAdminRoutes.includes(pathname)) {
        router.push(`/${role}/dashboard`);
        return;
      }
    }

    if (
      role &&
      ((isUserRoute && role !== 'user') ||
        (isAdminRoute && role !== 'admin'))
    ) {
      router.push(`/${role}/dashboard`);
      return;
    }

    setIsReady(true);
  }, [pathname, router]);

  if (!isReady) return null;

  return children;
}
