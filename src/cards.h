
#include <victor>

typedef char Card;

#define 
#define BLACK_BASE '^'
#define BLACK(n) ((Card)(BLACK_BASE + (n)))
#define PEACH_BASE '`'
#define PEACH(n) ((Card)(PEACH_BASE + (n)))


namespace {
    class Cards{
    public:
        Cards(){}
        ~Cards(){}
        bool isEatable(vector<Card> comingCards);
    private:
        vector<Card> m_cards;
    };
}
