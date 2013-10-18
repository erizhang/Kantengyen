#include "cards.h"

void Cards::appendCard(Card card)
{
    m_cards.push_back(card);
}

bool Cards::isValidShowOut()
{
    int count = 0;
    count = m_cards.size();
    if (count == 1){
        return true;
    }
    return false;
}
