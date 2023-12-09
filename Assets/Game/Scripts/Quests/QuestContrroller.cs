
using UnityEngine;

public class QuestContrroller : MonoBehaviour
{
    public Sprite[] mammaIcons, brosIcons, marretIcons;
    public Sprite mamma, bros, marret;
    public GameObject mammaMapIcon, brosMapIcon, marretMapIcon;


    public QuestItem mammaItem, marretItem;

    public static QuestContrroller Instance;

    // Start is called before the first frame update
    void Start()
    {
        Instance = this;
    }

    // Update is called once per frame
    void Update()
    {
        



    }



    public void SetItemActive(QuestItem item) {
        item.gameObject.SetActive(true);
    }

    public void StartQuest(Quest quest, QuestItem item) {
        quest.started = true;
        SetItemActive(item);

    }
    public void EndQuest(Quest quest) {

        quest.concluded = true; 
        quest.SetDialogue();
        quest.EndQuest();
    }

    public void SetItemCaugh(Quest quest) {

        quest.itemCaught = true;
        quest.onItemCaught();
       
       

    }

    
}
