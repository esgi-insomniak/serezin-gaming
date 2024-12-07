enum OK {
  FIND_ONE = 'Tournament fetch sucessfully',
  FIND_ALL = 'Tournaments fetch sucessfully',
}

enum CREATED {
  DEFAULT = 'Tournament create sucessfully',
}

enum NOT_FOUND {
  DEFAULT = 'Tournament not found',
}

enum BAD_REQUEST {
  DEFAULT = 'Tournament data malformed',
}

export const TournamentResponseMessageEnum = {
  OK,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
};
