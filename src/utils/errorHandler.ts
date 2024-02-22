import { Response } from 'express';
import { InputError, DatabaseError } from '../utils/customError';

export const handleCommonErrors = (error: Error, res: Response) => {
    if (error instanceof InputError) {
        // Handle input validation errors
        return res.status(400).json({
            data: {
                [error.module]: {
                    userErrors: [
                        {
                            message: error.message
                        }
                    ],
                }
            }
        });
    }

    if (error instanceof DatabaseError) {
        // Handle database-related errors
        return res.status(500).json({ message: 'Failed to update post' });
    }

    // Handle other types of errors...

    // For unhandled errors, return a generic response
    return res.status(500).json({ message: 'Internal Server Error' });
};