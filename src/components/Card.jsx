import { cn } from '../lib/utils';

export function Card({ className, children, ...props }) {
    return (
        <div className={cn("navy-card transition-all duration-300", className)} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn("p-6 pb-2", className)} {...props}>
            {children}
        </div>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={cn("p-6 pt-2", className)} {...props}>
            {children}
        </div>
    );
}
