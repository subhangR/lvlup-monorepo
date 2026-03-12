import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export interface BreadcrumbSegmentResolver {
  /** Regex to match the pathname */
  pattern: RegExp;
  /** Return breadcrumb segments: [{ label, to? }] */
  resolve: (pathname: string, match: RegExpMatchArray) => Array<{ label: string; to?: string }>;
}

export interface AppBreadcrumbProps {
  /** Map of route paths to display labels */
  routeLabels: Record<string, string>;
  /** Label shown for the home/root breadcrumb */
  homeLabel?: string;
  /** Path for the home link */
  homePath?: string;
  /** Custom segment resolvers for dynamic routes (e.g., /tenants/:id) */
  segmentResolvers?: BreadcrumbSegmentResolver[];
  className?: string;
}

export function AppBreadcrumb({
  routeLabels,
  homeLabel = "Dashboard",
  homePath = "/",
  segmentResolvers = [],
  className,
}: AppBreadcrumbProps) {
  const location = useLocation();
  const { pathname } = location;

  if (pathname === homePath) return null;

  // Check custom segment resolvers first
  for (const resolver of segmentResolvers) {
    const match = pathname.match(resolver.pattern);
    if (match) {
      const segments = resolver.resolve(pathname, match);
      return (
        <Breadcrumb className={className ?? "mb-4"}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={homePath}>{homeLabel}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {segments.map((segment, i) => (
              <span key={i} className="contents">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {segment.to ? (
                    <BreadcrumbLink asChild>
                      <Link to={segment.to}>{segment.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      );
    }
  }

  const currentLabel = routeLabels[pathname] ?? "Page";

  return (
    <Breadcrumb className={className ?? "mb-4"}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={homePath}>{homeLabel}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
