interface IButton {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}