export default function getChessPiece(piece) {
    switch (piece) {
        case 'p':
            return '♟';
        case 'P':
            return '♙';
        case 'r':
            return '♜';
        case 'R':
            return '♖';
        case 'n':
            return '♞';
        case 'N':
            return '♘';
        case 'b':
            return '♝';
        case 'B':
            return '♗';
        case 'q':
            return '♛';
        case 'Q':
            return '♕';
        case 'k':
            return '♚';
        case 'K':
            return '♔';
        default:
            return '';
    }
}