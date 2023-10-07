using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Dialogue : MonoBehaviour
{
    public Sprite[] profile;
    public string[] speechTxt;
    public string[] actorName;

    public LayerMask playerLayer;
    public float radius;

    private DialogueControl dc;
    private bool onRadius;
    private bool onDialogue;

    private void Start()
    {
        dc = FindObjectOfType<DialogueControl>();
    }

    private void Update() 
    {
        if (onRadius)
        {
    
            if ((Input.GetMouseButtonDown(0) || Input.touchCount > 0) && onRadius && !onDialogue)
            {
                Vector3 clickPosition;

                if (Input.touchCount > 0)
                {
                    Touch touch = Input.GetTouch(0);
                    clickPosition = Camera.main.ScreenToWorldPoint(touch.position);
                }
                else
                {
                    clickPosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
                }

                clickPosition.z = 0; 

                float distance = Vector2.Distance(transform.position, clickPosition);

                if (distance < 3.5f) 
                {
                    onDialogue = true;
                    dc.Speech(profile, speechTxt, actorName);
                }
            }

        }
    }


    private void FixedUpdate()
    {
        Interact();
    }

    public void Interact()
    {
        Collider2D hit = Physics2D.OverlapCircle(transform.position, radius, playerLayer);

        if(hit != null)
        {
            onRadius = true;
        }
        else
        {
            onRadius = false;
            if(onDialogue){
                onDialogue = false;
                dc.Close();
            }
        }
    }

    private void OnDrawGizmosSelected()
    {
        Gizmos.DrawWireSphere(transform.position, radius);
    }
}
