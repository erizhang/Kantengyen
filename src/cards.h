
#include <vector>

typedef char Card;

#define JACK  11
#define QUEEN 12
#define KING  13
#define ACE   14
#define DEE   15

#define HEART_BASE '!'
#define HEART(n) ((Card)(HEART_BASE + (n)))
#define DIAMOND_BASE '0'
#define DIMAOND(n) ((Card)(DIAMOND_BASE + (n)))
#define CLUB_BASE '@'
#define CLUB(n) ((Card)(CLUB_BASE + (n)))
#define SPADE_BASE '^'
#define SPADE(n) ((Card)(SPADE_BASE + (n)))

#define BLACK_JOKER '}'
#define RED_JOKER   '~'

#define H HEART
#define D DIAMOND
#define C CLUB
#define S SPADE

//namespace Game {
    class Cards{
    public:
        Cards(){}
        ~Cards(){}
        void appendCard(Card card);
        bool isValidShowOut();
    private:
        std::vector<Card> m_cards;
    };
//}

