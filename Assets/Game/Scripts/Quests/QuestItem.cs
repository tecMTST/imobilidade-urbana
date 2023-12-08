using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class QuestItem : MonoBehaviour
{
    public PlayerController player;
    public bool caught;
    public Quest quest;

    public GameObject questAlert;

    private bool isIluminated;


    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update() {

        questAlert.SetActive(IsIluminated());


    }

    private void OnMouseDown() {

        if (isIluminated) {
            QuestContrroller.Instance.SetItemCaugh(quest);
        }

    }

   

    public bool IsIluminated() {

        List<Collider2D> col = new();
        Physics2D.OverlapCollider(this.GetComponent<PolygonCollider2D>(), new ContactFilter2D(), col);

        return col.Any<Collider2D>(item => item.gameObject.name == "Lantern");

        
    }
}
